import React, { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [cart, setCart] = useState([]);

  const API_URL = "http://localhost:5000/products";

  // Fetch all products
  const fetchProducts = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add or Update
  const handleSubmit = () => {
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        fetchProducts();
        setForm({ name: "", price: "", description: "" });
        setEditingId(null);
      })
      .catch((err) => console.error("Error saving:", err));
  };

  // Delete product
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => fetchProducts())
      .catch((err) => console.error("Error deleting:", err));
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    setEditingId(product._id);
  };

  // 🛒 Add to cart
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // 🧾 Remove from cart
  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // 💰 Calculate total
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Simple E-commerce site </h2>

        {/* Form Section */}
        <div style={styles.form}>
          <input
            style={styles.input}
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            style={styles.input}
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            style={styles.input}
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div style={{ marginTop: 10 }}>
            <button
              style={{
                ...styles.button,
                backgroundColor: editingId ? "#007bff" : "#28a745",
              }}
              onClick={handleSubmit}
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                style={{
                  ...styles.button,
                  backgroundColor: "#6c757d",
                  marginLeft: 10,
                }}
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", price: "", description: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Product List */}
        <h3 style={styles.subtitle}>Products</h3>
        {products.length === 0 ? (
          <p style={{ color: "#666" }}>No products yet.</p>
        ) : (
          <ul style={styles.list}>
            {products.map((p) => (
              <li key={p._id} style={styles.listItem}>
                <div>
                  <strong>{p.name}</strong> — ksh{p.price}
                  <div style={{ color: "#555", fontSize: "0.9em" }}>
                    {p.description}
                  </div>
                </div>
                <div>
                  <button
                    style={{
                      ...styles.buttonSmall,
                      backgroundColor: "#007bff",
                    }}
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      ...styles.buttonSmall,
                      backgroundColor: "#dc3545",
                      marginLeft: 5,
                    }}
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                  <button
                    style={{
                      ...styles.buttonSmall,
                      backgroundColor: "#28a745",
                      marginLeft: 5,
                    }}
                    onClick={() => handleAddToCart(p)}
                  >
                    + Cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Cart Section */}
        <h3 style={styles.subtitle}> Cart</h3>
        {cart.length === 0 ? (
          <p style={{ color: "#666" }}>Cart is empty.</p>
        ) : (
          <ul style={styles.list}>
            {cart.map((item) => (
              <li key={item._id} style={styles.listItem}>
                <div>
                  {item.name} × {item.qty} — ksh.{item.price * item.qty}
                </div>
                <button
                  style={{
                    ...styles.buttonSmall,
                    backgroundColor: "#dc3545",
                  }}
                  onClick={() => handleRemoveFromCart(item._id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {cart.length > 0 && (
          <h4 style={{ textAlign: "right", color: "#333" }}>
            Total: ksh{totalPrice.toFixed(2)}
          </h4>
        )}
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f6fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 15,
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 650,
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 25,
    color: "#444",
    borderBottom: "2px solid #eee",
    paddingBottom: 5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
  buttonSmall: {
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: 10,
  },
  listItem: {
    background: "#fafafa",
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export default App;
