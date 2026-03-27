import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        getProduct(id)
            .then((res) => { setProduct(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="detail-container">
            <Link to="/" className="back-link">← Back to Products</Link>
            <div className="product-detail-card">
                <div className="detail-image">
                    <img src={product.image} alt={product.title} />
                </div>
                <div className="detail-info">
                    <span className="category-badge">{product.category}</span>
                    <h2>{product.title}</h2>
                    <p className="detail-description">{product.description}</p>
                    <div className="detail-price">${product.price}</div>
                    <button className="btn btn-large" onClick={handleAddToCart}>
                        {added ? "✓ Added to Cart!" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;