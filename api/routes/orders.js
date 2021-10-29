const e = require('express');
const express = require('express');
const router = express.Router();
const OrderActions = require('../controllers/order');
const checkAuth = require('../middleware/check_auth');

router.get('/', checkAuth, OrderActions.getOrders);
router.post('/', checkAuth, OrderActions.addOrder);
router.get('/:orderId', checkAuth, OrderActions.getOrderById);
router.delete('/:orderId', checkAuth, OrderActions.deleteOrder);

module.exports = router;