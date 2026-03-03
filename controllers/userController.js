import User from '../models/User.js';

// helper to seed a default user if none exist
export const seedUsers = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            const sample = new User({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890',
                address: '123 Main St',
                city: 'Anytown',
                postalCode: '12345'
            });
            await sample.save();
            console.log('🐣 Seeded initial user');
        }
    } catch (err) {
        console.error('Error seeding users:', err.message);
    }
};

// GET all users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            await seedUsers();
            const refreshed = await User.find();
            return res.json(refreshed);
        }
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// GET user by ID
export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// CREATE user
export const createUser = async (req, res, next) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        next(error);
    }
};

// UPDATE user
export const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                city: req.body.city,
                postalCode: req.body.postalCode,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// DELETE user
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', user });
    } catch (error) {
        next(error);
    }
};
