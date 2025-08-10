# Real-Time Order Tracker

A full-stack application to create, update, and track food orders in real time using:
- ASP.NET Core + HotChocolate (GraphQL)
- Apache Kafka for event streaming
- React + Apollo Client for frontend subscriptions

---

## Features

- Create and update orders via GraphQL
- Real-time UI updates through GraphQL Subscriptions
- Kafka-integrated backend: events are published and consumed
- Clean separation between business logic and streaming

## WorkFlow
1. React sends a GraphQL mutation (createOrder)
2. .NET backend creates the order + publishes to Kafka
3. Kafka consumer receives the message and emits a GraphQL subscription event
4. Apollo Client (React) receives the update over WebSocket and re-renders the UI

Kafka Setup (Within your kafka directory)
1. Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties
2. Start Kafka Server
bin/kafka-server-start.sh config/server.properties
3. Create Topics
bin/kafka-topics.sh --create --topic order.created --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic order.status.updated --bootstrap-server localhost:9092
