import Product from '../models/Product.js';

// helper to seed default product if none exist
export const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            const sample = new Product({
                name: 'The Alchemist',
                price: 399,
                description: 'A philosophical fable',
                author: 'Paulo Coelho',
                quantity: 5
            });
            await sample.save();
            console.log('🐣 Seeded initial product');
        }
    } catch (err) {
        console.error('Error seeding products:', err.message);
    }
};

// GET all products
export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
            await seedProducts();
            const refreshed = await Product.find();
            return res.json(refreshed);
        }
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// GET product by ID
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

// CREATE product
export const createProduct = async (req, res, next) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            author: req.body.author,
            quantity: req.body.quantity
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        next(error);
    }
};

// UPDATE product
export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                author: req.body.author,
                quantity: req.body.quantity,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

// DELETE product
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully', product });
    } catch (error) {
        next(error);
    }
};
