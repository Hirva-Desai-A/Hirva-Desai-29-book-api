import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// helper to seed a default cart if none exist
export const seedCarts = async () => {
    try {
        const count = await Cart.countDocuments();
        if (count === 0) {
            let user = await User.findOne();
            let product = await Product.findOne();

            if (!user) {
                user = await User.create({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });
            }
            if (!product) {
                product = await Product.create({
                    name: 'Sample Book',
                    price: 9.99,
                    description: 'Sample product',
                    author: 'Unknown',
                    quantity: 1
                });
            }

            const sample = new Cart({
                userId: user._id,
                items: [{ productId: product._id, quantity: 1, price: product.price }],
                totalPrice: product.price
            });
            await sample.save();
            console.log('🐣 Seeded initial cart');
        }
    } catch (err) {
        console.error('Error seeding carts:', err.message);
    }
};

// GET all carts
export const getCart = async (req, res, next) => {
    try {
        let carts = await Cart.find().populate('userId').populate('items.productId');
        if (carts.length === 0) {
            await seedCarts();
            carts = await Cart.find().populate('userId').populate('items.productId');
        }
        res.json(carts);
    } catch (error) {
        next(error);
    }
};

// GET cart by user ID
export const getCartByUserId = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('userId').populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        next(error);
    }
};

// ADD item to cart
export const addToCart = async (req, res, next) => {
    try {
        const { userId, productId, quantity, price } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity, price }],
                totalPrice: price * quantity
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, price });
            }
            cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }

        const savedCart = await cart.save();
        const populatedCart = await savedCart.populate('userId').populate('items.productId');
        res.status(201).json(populatedCart);
    } catch (error) {
        next(error);
    }
};

// UPDATE cart item quantity
export const updateCartItem = async (req, res, next) => {
    try {
        const { userId, productId, quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        cart.updatedAt = Date.now();

        const updatedCart = await cart.save();
        const populatedCart = await updatedCart.populate('userId').populate('items.productId');
        res.json(populatedCart);
    } catch (error) {
        next(error);
    }
};

// REMOVE item from cart
export const removeFromCart = async (req, res, next) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cart.items.splice(itemIndex, 1);
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        cart.updatedAt = Date.now();

        const updatedCart = await cart.save();
        const populatedCart = await updatedCart.populate('userId').populate('items.productId');
        res.json(populatedCart);
    } catch (error) {
        next(error);
    }
};

// CLEAR entire cart
export const clearCart = async (req, res, next) => {
    try {
        const { userId } = req.body;

        const cart = await Cart.findOneAndDelete({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        next(error);
    }
};
