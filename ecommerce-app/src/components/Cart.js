import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
    const { cart, removeFromCart } = useContext(CartContext);

    return (
        <div className="container">
            <h2>Your Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link to="/">Start shopping</Link></p>
            ) : (
                <div>
                    {cart.map((item, index) => (
                        <div key={index} style={{ display: "flex", borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                            <img src={item.image} alt={item.title} style={{ width: "80px", marginRight: "20px" }} />
                            <div>
                                <h4>{item.title}</h4>
                                <p className="price">${item.price}</p>
                                <button className="btn" style={{ backgroundColor: "#d9534f" }} onClick={() => removeFromCart(item.id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div style={{ marginTop: "20px" }}>
                        <Link to="/checkout"><button className="btn">Proceed to Checkout</button></Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;