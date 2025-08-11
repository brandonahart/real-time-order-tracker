# Real-Time Order Tracker

A full-stack application to create, update, and track food orders in real time using:
- ASP.NET Core + HotChocolate (GraphQL)
- Apache Kafka for event streaming
- React + Apollo Client for frontend subscriptions
- PostgreSQL for persistent storage

---

## Features

- Create and update orders via GraphQL
- Real-time UI updates through GraphQL Subscriptions
- Kafka-integrated backend: events are published and consumed
- Clean separation between business logic and streaming

## WorkFlow
1. React sends a GraphQL mutation (createOrder)
2. .NET backend creates the order + publishes to Kafka
3. .NET backend stores the order in the Orders table in postgreSQL
4. Kafka consumer receives the message and emits a GraphQL subscription event
5. Apollo Client (React) receives the update over WebSocket and re-renders the UI

## Kafka Setup (Within your kafka directory)
1. Start Zookeeper <br>
bin/zookeeper-server-start.sh config/zookeeper.properties
2. Start Kafka Server <br>
bin/kafka-server-start.sh config/server.properties 
3. Create Topics<br>
bin/kafka-topics.sh --create --topic order.created --bootstrap-server localhost:9092 <br>
bin/kafka-topics.sh --create --topic order.status.updated --bootstrap-server localhost:9092

## Backend and Frontend run
1. git clone https://github.com/your-username/order-tracker.git
2. cd order-tracker/OrderService
3. dotnet run
4. cd ../order-tracker-client
5. npm install
6. npm start
