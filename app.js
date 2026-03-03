import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import errorHandler from "./middleware/errorHandler.js";

// seed helpers
import { seedProducts } from "./controllers/productController.js";
import { seedUsers } from "./controllers/userController.js";
import { seedCarts } from "./controllers/cartController.js";
import { seedOrders } from "./controllers/orderController.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("MongoDB connected successfully");
        await seedProducts();
        await seedUsers();
        await seedCarts();
        await seedOrders();
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });

// Routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

// Error handler
console.log("errorHandler is:", errorHandler);
app.use(errorHandler);


// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;