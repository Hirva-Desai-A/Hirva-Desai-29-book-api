// ES MODULE VALIDATION MIDDLEWARE

export const validateProduct = (req, res, next) => {
    const { name, price } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({
            message: "Name and price are required"
        });
    }

    next();
};