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
