exports.validateProduct = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({ message: "Name and price are required" });
    }
    next();
};

exports.validateUser = (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ message: "User name is required" });
    }
    next();
};
