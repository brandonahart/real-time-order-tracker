namespace OrderService.Models {
    public class Order {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string CustomerName { get; set; }
        public string Item { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}