'use client'
import React, { useEffect, useState } from "react"

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] =  useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json();
        setProducts(data.products)
      } catch (err) {
        setError(error.message)
      } finally {
        setLoading(false)
      };
    };
    fetchProducts()
  }, []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
    <h1>Ecommerce App</h1>
    <div className="products">
      {products?.map((product) => (
        <div key={product._id} className="product-card">
          <h2>{product.name}</h2>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Category: {product.category}</p>
        </div>
      ))}
    </div>
  </div>
  )

};