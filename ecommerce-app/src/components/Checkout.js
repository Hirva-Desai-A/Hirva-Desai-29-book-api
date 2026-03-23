import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", address: "" });
    const [placed, setPlaced] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleOrder = () => {
        if (!form.name || !form.email || !form.address) {
            alert("Please fill in all fields");
            return;
        }
        clearCart();
        setPlaced(true);
        setTimeout(() => navigate("/"), 3000);
    };

    if (placed)
        return (
            <div className="success-box">
                <h2>✅ Order Placed Successfully!</h2>
                <p>Thank you, {form.name}! Redirecting to home...</p>
            </div>
        );

    return (
        <div className="checkout-container">
            <h2 className="page-title">Checkout</h2>
            <div className="checkout-layout">
                <div className="checkout-form">
                    <h3>Shipping Details</h3>
                    <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="input-field" />
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-field" />
                    <textarea name="address" placeholder="Delivery Address" value={form.address} onChange={handleChange} className="input-field" rows={3} />
                    <button className="btn btn-large" onClick={handleOrder}>Place Order</button>
                </div>
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    {cart.map((item) => (
                        <div key={item.id} className="summary-item">
                            <span>{item.title.substring(0, 30)}...</span>
                            <span>×{item.quantity} — ${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="summary-total">Total: <strong>${cartTotal.toFixed(2)}</strong></div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;