import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// CREATE order
router.post("/", async (req, res, next) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
});

// READ orders
router.get("/", async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("items.product");
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (err) {
        next(err);
    }
});

// DELETE order
router.delete("/:id", async (req, res, next) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted" });
    } catch (err) {
        next(err);
    }
});

export default router;