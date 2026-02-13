const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateOrder } = require('../middleware/validate');

router.get('/', orderController.getOrders);
router.post('/', validateOrder, orderController.createOrder);

module.exports = router;
