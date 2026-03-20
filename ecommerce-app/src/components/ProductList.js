import React, { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import { Link } from "react-router-dom";

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts().then(res => setProducts(res.data));
    }, []);

    return (
        <div>
            <h2>Products</h2>
            <div>
                {products.map(p => (
                    <div key={p.id}>
                        <Link to={`/product/${p.id}`}>
                            <h4>{p.title}</h4>
                        </Link>
                        <p>${p.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;