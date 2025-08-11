import React, { useEffect, useState } from 'react';
import { gql, useQuery, useSubscription } from '@apollo/client';

const ORDER_STATUS_UPDATED = gql`
  subscription {
    onOrderStatusUpdated {
      id
      customerName
      item
      status
      createdAt
    }
  }
`;

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      customerName
      item
      status
      createdAt
    }
  }
`;

export default function OrderUpdates() {
  // Initial list
  const { data: queryData, loading: queryLoading, error: queryError } = useQuery(GET_ORDERS);

  // Live updates
  const { data: subData } = useSubscription(ORDER_STATUS_UPDATED);

  // State always starts as []
  const [orders, setOrders] = useState([]);

  // When the initial query resolves, populate state
  useEffect(() => {
    if (queryData?.orders) {
      setOrders(queryData.orders);
    }
  }, [queryData]);

  // When a status update arrives, merge into list
  useEffect(() => {
    const upd = subData?.onOrderStatusUpdated;
    if (!upd) return;

    setOrders(prev => {
      const exists = prev.some(o => o.id === upd.id);
      if (!exists) return [...prev, upd];              // if not present, append
      return prev.map(o => (o.id === upd.id ? { ...o, status: upd.status } : o));
    });
  }, [subData]);

  if (queryLoading && orders.length === 0) return <p>Loading…</p>;
  if (queryError) return <p>Error: {queryError.message}</p>;

  return (
    <div style={{ padding: '1rem', border: '1px solid gray' }}>
      <h3>🚀 Order Updates</h3>
      {orders.map(order => (
        <div key={order.id} style={{
      marginBottom: '1.5rem',
      padding: '1rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff'
    }}>
          <h4>Order ID: {order.id}</h4>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Item:</strong> {order.item}</p>
          <p><strong>ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
      ))}
    </div>
  );
}