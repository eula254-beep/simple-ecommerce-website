import React, { useEffect, useState } from "react";
import { getProducts, addToCart } from "../api";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleAddToCart = async (id) => {
    await addToCart({ productId: id, quantity: 1 });
    alert("✅ Added to cart!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🛒 Products</h2>
      <div style={{ display: "grid", gap: 15 }}>
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 10,
            }}
          >
            <h3>{p.name}</h3>
            <p>Price: Ksh {p.price}</p>
            <button onClick={() => handleAddToCart(p._id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
