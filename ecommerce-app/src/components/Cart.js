import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0)
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <Link to="/"><button className="btn">Continue Shopping</button></Link>
            </div>
        );

    return (
        <div className="cart-container">
            <h2 className="page-title">Shopping Cart</h2>
            {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.title} className="cart-item-img" />
                    <div className="cart-item-info">
                        <h4>{item.title}</h4>
                        <p className="price">${item.price}</p>
                    </div>
                    <div className="cart-item-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span className="qty-display">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                </div>
            ))}
            <div className="cart-summary">
                <div className="cart-total">Total: <strong>${cartTotal.toFixed(2)}</strong></div>
                <Link to="/checkout"><button className="btn btn-large">Proceed to Checkout</button></Link>
            </div>
        </div>
    );
}

export default Cart;