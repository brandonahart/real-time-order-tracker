using OrderService.Models;

namespace OrderService.GraphQL.Subscriptions {
    public class OrderSubscription {
        [Subscribe]
        public Order OnOrderCreated([EventMessage] Order order) => order;

        [Subscribe]
        public Order OnOrderStatusUpdated([EventMessage] Order order) => order;
    }
}