
import { gql, useMutation, useSubscription } from '@apollo/client';
import { useState } from 'react';

const CREATE_ORDER = gql`
    mutation CreateOrder($customerName: String!, $item: String!) {
        createOrder(customerName: $customerName, item: $item) {
            id
            customerName
            item
        }
    }
`;

const UPDATE_ORDER_STATUS = gql`
    mutation UpdateOrderStatus($id: UUID!, $status: String!) {
        updateOrderStatus(id: $id, status: $status) {
            id
            status
        }
    }
`;


export default function PlaceOrder() {
    const [customerName, setCustomerName] = useState('');
    const [item, setItem] = useState('');
    const [orderId, setOrderId] = useState('');
    const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);
    const [updateOrderStatus, { loading: updating, error: updateError }] = useMutation(UPDATE_ORDER_STATUS);

    const handleSubmit = async (event) => {

        event.preventDefault();
        try {
            const { data } = await createOrder({
                variables: { customerName, item }
            });
            alert(`Order placed! ID: ${data.createOrder.id}`);
            setCustomerName('');
            setItem('');
        } catch (err) {
            alert('Failed to place order.');
        }
    };
    
    const handleDeliver = async (event) => {
        console.log("Delivering order with ID:", orderId, typeof orderId);        event.preventDefault();
        const stat = "Delivered";
        try {
            const { data } = await updateOrderStatus({
                variables: {id: orderId, status: stat}
            });
            setOrderId('');
        } catch (err) {
            console.error("Error delivering order:", err);
            if (err.graphQLErrors) {
                err.graphQLErrors.forEach(e => console.error("GraphQL Error:", e.message));
            }
            if (err.networkError) {
                console.error("Network Error:", err.networkError);
            }
            alert('Failed to deliver order.');
        }
    };    

    return (
        <div style={{ padding: '1rem', border: '1px solid gray' }}>
            <h3>📦 Place Order</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Item:
                    <input
                        type="text"
                        value={item}
                        onChange={e => setItem(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
            <hr />

            <h3>🚚 Deliver Order</h3>
            <form onSubmit={handleDeliver}>
                <label>
                    Order ID:
                    <input
                        type="text"
                        value={orderId}
                        onChange={e => setOrderId(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit" disabled={updating}>
                    {updating ? 'Delivering...' : 'Deliver Order'}
                </button>
            </form>
            {updateError && <p style={{ color: 'red' }}>Error: {updateError.message}</p>}
        </div>
    );
}