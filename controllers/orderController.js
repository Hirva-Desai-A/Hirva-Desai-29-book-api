import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// helper to seed a default order if none exist
export const seedOrders = async () => {
    try {
        const count = await Order.countDocuments();
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

            const sampleOrder = new Order({
                userId: user._id,
                items: [{ productId: product._id, quantity: 1, price: product.price }],
                totalAmount: product.price,
                shippingAddress: '123 Sample St',
                status: 'Placed',
                paymentStatus: 'Pending'
            });
            await sampleOrder.save();
            console.log('🐣 Seeded initial order');
        }
    } catch (err) {
        console.error('Error seeding orders:', err.message);
    }
};

// GET all orders
export const getOrders = async (req, res, next) => {
    try {
        let orders = await Order.find().populate('userId').populate('items.productId');
        if (orders.length === 0) {
            await seedOrders();
            orders = await Order.find().populate('userId').populate('items.productId');
        }
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// GET order by ID
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId').populate('items.productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

// CREATE order
export const createOrder = async (req, res, next) => {
    try {
        const { userId, items, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        let totalAmount = 0;
        items.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        const order = new Order({
            userId,
            items,
            totalAmount,
            shippingAddress,
            status: 'Placed'
        });

        const savedOrder = await order.save();
        const populatedOrder = await savedOrder.populate('userId').populate('items.productId');

        // Clear cart after order creation
        await Cart.findOneAndDelete({ userId });

        res.status(201).json(populatedOrder);
    } catch (error) {
        next(error);
    }
};

// UPDATE order status
export const updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
                paymentStatus: req.body.paymentStatus,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        ).populate('userId').populate('items.productId');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

// DELETE order
export const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully', order });
    } catch (error) {
        next(error);
    }
};

// GET orders by user ID
export const getOrdersByUserId = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('userId').populate('items.productId');
        res.json(orders);
    } catch (error) {
        next(error);
    }
};
