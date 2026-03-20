import express from "express";
import Product from "../models/Product.js";
import { validateProduct } from "../middleware/validateRequest.js";
const router = express.Router();

router.post("/", validateProduct, async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
});

router.get("/", async (req, res, next) => {
    try {
        res.json(await Product.find());
    } catch (err) {
        next(err);
    }
});


// PUT product
router.put("/:id", async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
});


router.delete("/:id", async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        next(err);
    }
});

export default router;