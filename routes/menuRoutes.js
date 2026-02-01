const express = require('express');
const router = express.Router();
const { 
  getMenuItems, 
  createMenuItem, 
  toggleAvailability, 
  getTopSellers 
} = require('../controllers/menuController');

// Analytics route must come before /:id routes to avoid being treated as an ID
router.get('/analytics/top-sellers', getTopSellers);

router.get('/', getMenuItems);
router.post('/', createMenuItem);
router.patch('/:id/availability', toggleAvailability);

module.exports = router;