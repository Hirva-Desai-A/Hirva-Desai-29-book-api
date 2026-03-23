import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import { CartProvider, useCart } from "./context/CartContext";

function NavBar() {
  const { cartCount } = useCart();
  return (
    <div className="header">
      <h2>🛍️ My E-Commerce Store</h2>
      <nav>
        <Link to="/">Home</Link> |
        <Link to="/cart"> 🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</Link>
      </nav>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;