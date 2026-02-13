let cart = [];

exports.getCart = (req, res) => {
    res.json(cart);
};

exports.addToCart = (req, res) => {
    const item = {
        id: cart.length + 1,
        productId: req.body.productId
    };
    cart.push(item);
    res.status(201).json(item);
};
