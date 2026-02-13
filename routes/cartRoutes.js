const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { validateCart } = require('../middleware/validate');

router.get('/', cartController.getCart);
router.post('/', validateCart, cartController.addToCart);

module.exports = router;
