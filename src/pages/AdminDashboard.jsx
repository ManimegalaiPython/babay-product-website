import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h2>Admin Dashboard - Manage Products</h2>
      <button className="add-to-cart" style={{ marginBottom: '20px' }}>Add New Product</button>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card" style={{ padding: '10px' }}>
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button>Edit</button>
              <button style={{ backgroundColor: 'var(--red)', color: 'white' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;