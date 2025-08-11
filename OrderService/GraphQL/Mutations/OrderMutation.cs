using OrderService.Models;
using OrderService.Services;
using OrderService.Kafka;
using System.Text.Json;

namespace OrderService.GraphQL.Mutations {
    public class OrderMutation {
        public async Task<Order> CreateOrder(
            string customerName,
            string item,
            [Service] OrderService.Services.OrderService service,
            [Service] KafkaProducer producer) {

            var order = await service.CreateOrder(customerName, item);
            var message = JsonSerializer.Serialize(order);
            producer.Send("order.created", message);
            producer.Send("order.status.updated", message);
            return order;
        }

        public async Task<Order?> UpdateOrderStatus(
            Guid id,
            string status,
            [Service] OrderService.Services.OrderService service,
            [Service] KafkaProducer producer) {

            var order = await service.UpdateStatus(id, status);
            if (order != null) {
                var message = JsonSerializer.Serialize(order);
                producer.Send("order.status.updated", message);
            }
            return order;
        }
    }
}