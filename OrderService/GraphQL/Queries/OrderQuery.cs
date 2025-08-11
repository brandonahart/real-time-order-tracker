using OrderService.Models;
using OrderService.Services;

namespace OrderService.GraphQL.Queries {
    public class OrderQuery {
        public Task<IEnumerable<Order>> GetOrders([Service] Services.OrderService service)
        {
            return Task.FromResult(service.GetAllOrders());
        }

        public Task<Order?> GetOrderById(Guid id, [Service] Services.OrderService service) => service.GetOrderById(id);
    }
}