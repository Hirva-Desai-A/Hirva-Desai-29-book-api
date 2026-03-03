import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// CREATE / UPDATE cart
router.post("/", async (req, res, next) => {
    try {
        const cart = await Cart.create(req.body);
        res.status(201).json(cart);
    } catch (err) {
        next(err);
    }
});

// READ cart
router.get("/:userId", async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId })
            .populate("items.product");
        res.json(cart);
    } catch (err) {
        next(err);
    }
});

// DELETE cart
router.delete("/:id", async (req, res, next) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ message: "Cart deleted" });
    } catch (err) {
        next(err);
    }
});
router.put("/:id", async (req, res, next) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.json(cart);
    } catch (err) {
        next(err);
    }
});
export default router;   // ⭐ THIS LINE IS REQUIRED