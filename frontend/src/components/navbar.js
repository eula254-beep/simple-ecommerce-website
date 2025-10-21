import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "white" }}>
      <Link to="/" style={{ color: "white", marginRight: "15px" }}>Products</Link>
      <Link to="/cart" style={{ color: "white", marginRight: "15px" }}>Cart</Link>
      <Link to="/login" style={{ color: "white", marginRight: "15px" }}>Login</Link>
      <Link to="/register" style={{ color: "white" }}>Register</Link>
    </nav>
  );
}

export default Navbar;
