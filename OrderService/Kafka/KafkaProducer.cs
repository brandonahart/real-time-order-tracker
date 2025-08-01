using Confluent.Kafka;

namespace OrderService.Kafka {
    public class KafkaProducer {
        private readonly IProducer<Null, string> _producer;

        public KafkaProducer() {
            var config = new ProducerConfig {
                BootstrapServers = "localhost:9092"
            };
            _producer = new ProducerBuilder<Null, string>(config).Build();
        }

        public void Send(string topic, string message) {
            _producer.Produce(topic, new Message<Null, string> { Value = message });
        }
    }
}