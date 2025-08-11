using Microsoft.EntityFrameworkCore;
using OrderService.Models;

namespace OrderService.Services {
    public class OrderService {
        private readonly AppDbContext _db;
        public OrderService(AppDbContext db) { _db = db; }

        public async Task<Order> CreateOrder(string customerName, string item)
        {
            var order = new Order { CustomerName = customerName, Item = item };
            _db.Orders.Add(order);
            await _db.SaveChangesAsync();
            return order;
        }

        public IEnumerable<Order> GetAllOrders() => _db.Orders.ToList();

        public Task<Order?> GetOrderById(Guid id)
        {
            return _db.Orders.FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order?> UpdateStatus(Guid id, string status) {
            var order = await GetOrderById(id);
            if (order != null) order.Status = status;
            _db.SaveChanges();
            return order;
        }
    }
}