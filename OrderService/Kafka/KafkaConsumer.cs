using Confluent.Kafka;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using HotChocolate.Subscriptions;
using OrderService.Models;
using System.Text.Json;

namespace OrderService.Kafka {
    public class KafkaConsumer : BackgroundService {
        private readonly ILogger<KafkaConsumer> _logger;
        private readonly IConsumer<Ignore, string> _consumer;
        private readonly ITopicEventSender _eventSender;

        public KafkaConsumer(ILogger<KafkaConsumer> logger, ITopicEventSender eventSender) {
            _logger = logger;
            _eventSender = eventSender;

            var config = new ConsumerConfig {
                GroupId = "order-tracking-consumer",
                BootstrapServers = "localhost:9092",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            _consumer = new ConsumerBuilder<Ignore, string>(config).Build();
            _consumer.Subscribe(new[] { "order.created", "order.status.updated" });
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken) {
            return Task.Run(async () => {
                while (!stoppingToken.IsCancellationRequested) {
                    var result = _consumer.Consume(stoppingToken);
                    var message = result.Message.Value;
                    _logger.LogInformation($"[KafkaConsumer] Topic: {result.Topic} | Message: {message}");

                    try {
                        var order = JsonSerializer.Deserialize<Order>(message);
                        if (order != null) {
                            var topic = result.Topic == "order.created" ? "OnOrderCreated" : "OnOrderStatusUpdated";
                            await _eventSender.SendAsync(topic, order, stoppingToken);
                        }
                    } catch (Exception ex) {
                        _logger.LogError(ex, "Failed to process Kafka message");
                    }
                }
            }, stoppingToken);
        }

        public override void Dispose() {
            _consumer.Close();
            _consumer.Dispose();
            base.Dispose();
        }
    }
}