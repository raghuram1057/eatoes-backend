const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getTopSellers
} = require('../controllers/orderController');

// Specific analytics route must stay above :id routes
router.get('/analytics/top-sellers', getTopSellers);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;