import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Checkout() {
    const { cart } = useContext(CartContext);
    const total = cart.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="checkout-container">
            <h2>Checkout Summary</h2>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>{item.title} - ${item.price}</li>
                ))}
            </ul>
            <h3>Total Amount: ${total.toFixed(2)}</h3>
            <button onClick={() => alert("Order Placed Successfully!")}>
                Place Order
            </button>
        </div>
    );
}

export default Checkout;