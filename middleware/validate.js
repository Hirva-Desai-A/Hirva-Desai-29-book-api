// validation middleware for different resources
exports.validateProduct = (req, res, next) => {
    if (!req.body.name || typeof req.body.price !== 'number') {
        return res.status(400).json({ message: "Product name and numeric price are required" });
    }
    next();
};

exports.validateUser = (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ message: "User name is required" });
    }
    next();
};

exports.validateCart = (req, res, next) => {
    if (!req.body.productId) {
        return res.status(400).json({ message: "productId is required for cart items" });
    }
    next();
};

exports.validateOrder = (req, res, next) => {
    // order creation might require cart or user reference, keep simple
    if (!req.body.userId) {
        return res.status(400).json({ message: "userId is required to create an order" });
    }
    next();
};
