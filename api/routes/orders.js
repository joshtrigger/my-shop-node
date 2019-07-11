const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const auth = require('../middleware/authenticate');

router.get('/', auth, ordersController.getAllOrders);

router.post('/', auth, ordersController.addNewOrder);

router.get('/:orderId', auth, ordersController.getSpecificOrder);

router.delete('/:orderId', auth, ordersController.deleteOrder);

module.exports = router;