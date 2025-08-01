import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient';
import OrderUpdates from './OrderUpdates';
import PlaceOrder from './Components/PlaceOrder';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
          <h2>Real-Time Order Tracker 📦</h2>
          <nav>
            <Link to="/">Home</Link> | <Link to="/place-order">Place Order</Link>
          </nav>
          <Routes>
            <Route path="/" element={<OrderUpdates />} />
            <Route path="/place-order" element={<PlaceOrder />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;