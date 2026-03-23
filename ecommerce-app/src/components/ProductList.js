import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import { useCart } from "../context/CartContext";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        getProducts()
            .then((res) => { setProducts(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div>
            <h2 className="page-title">Products</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <img src={product.image} alt={product.title} />
                        <h4>{product.title}</h4>
                        <p className="price">${product.price}</p>
                        <div className="card-actions">
                            <Link to={`/product/${product.id}`}>
                                <button className="btn btn-outline">View Details</button>
                            </Link>
                            <button className="btn" onClick={() => addToCart(product)}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;