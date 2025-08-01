using OrderService.Models;
using OrderService.Services;

namespace OrderService.GraphQL.Queries {
    public class OrderQuery {
        public IEnumerable<Order> GetOrders([Service] OrderService.Services.OrderService service) => service.GetAllOrders();

        public Order GetOrderById(Guid id, [Service] OrderService.Services.OrderService service) => service.GetOrderById(id);
    }
}