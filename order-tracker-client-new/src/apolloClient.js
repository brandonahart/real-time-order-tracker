import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP connection for queries/mutations
const httpLink = new HttpLink({
  uri: 'http://localhost:5186/graphql',
});

// WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5186/graphql',
  options: {
    reconnect: true,
  },
});

// Route based on operation type (query/mutation vs subscription)
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});