using OrderService.Models;
using OrderService.Services;
using OrderService.Kafka;
using System.Text.Json;

namespace OrderService.GraphQL.Mutations {
    public class OrderMutation {
        public Order CreateOrder(
            string customerName,
            string item,
            [Service] OrderService.Services.OrderService service,
            [Service] KafkaProducer producer) {

            var order = service.CreateOrder(customerName, item);
            var message = JsonSerializer.Serialize(order);
            producer.Send("order.created", message);
            producer.Send("order.status.updated", message);
            return order;
        }

        public Order UpdateOrderStatus(
            Guid id,
            string status,
            [Service] OrderService.Services.OrderService service,
            [Service] KafkaProducer producer) {

            var order = service.UpdateStatus(id, status);
            if (order != null) {
                var message = JsonSerializer.Serialize(order);
                producer.Send("order.status.updated", message);
            }
            return order;
        }
    }
}