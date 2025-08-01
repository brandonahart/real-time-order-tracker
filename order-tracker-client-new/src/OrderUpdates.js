import React, { useEffect, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';

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
export default function OrderUpdates() {
  const { data, loading } = useSubscription(ORDER_STATUS_UPDATED);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (data && data.onOrderStatusUpdated) {
      setOrders(prev =>
        // Replace if already exists, else add new
        [
          ...prev.filter(o => o.id !== data.onOrderStatusUpdated.id),
          data.onOrderStatusUpdated
        ]
      );
    }
  }, [data]);

  if (loading && orders.length === 0) return <p>Waiting for updates...</p>;

  return (
    <div style={{ padding: '1rem', border: '1px solid gray' }}>
      <h3>🚀 Order Updates</h3>
      {orders.map(order => (
        <div key={order.id} style={{ marginBottom: '1rem' }}>
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