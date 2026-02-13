const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middleware/validate');

router.get('/', userController.getUsers);
router.post('/', validateUser, userController.createUser);

module.exports = router;
