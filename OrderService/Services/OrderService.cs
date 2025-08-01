using OrderService.Models;

namespace OrderService.Services {
    public class OrderService {
        private readonly List<Order> _orders = new();

        public Order CreateOrder(string customerName, string item) {
            var order = new Order { CustomerName = customerName, Item = item };
            _orders.Add(order);
            return order;
        }

        public IEnumerable<Order> GetAllOrders() => _orders;

        public Order GetOrderById(Guid id) => _orders.FirstOrDefault(o => o.Id == id);

        public Order UpdateStatus(Guid id, string status) {
            var order = GetOrderById(id);
            if (order != null) order.Status = status;
            return order;
        }
    }
}