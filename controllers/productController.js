let products = [
    { id: 1, name: "The Alchemist", price: 399 },
    { id: 2, name: "Atomic Habits", price: 499 }
];

exports.getProducts = (req, res) => {
    res.json(products);
};

exports.createProduct = (req, res) => {
    const product = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(product);
    res.status(201).json(product);
};
