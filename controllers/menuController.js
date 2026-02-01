const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

// GET /api/menu (Filters + Search)
exports.getMenuItems = async (req, res, next) => {
  try {
    const { category, isAvailable, q } = req.query;
    let query = {};

    if (q) query.$text = { $search: q };
    if (category) query.category = category;
    if (isAvailable) query.isAvailable = isAvailable === 'true';

    const items = await MenuItem.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) { next(error); }
};

// POST /api/menu (Create)
exports.createMenuItem = async (req, res, next) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) { next(error); }
};

// PATCH /api/menu/:id/availability (Optimistic UI Target)
exports.toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json(item);
  } catch (error) { next(error); }
};

// GET /api/analytics/top-sellers (Aggregation Challenge)
exports.getTopSellers = async (req, res, next) => {
  try {
    const topSellers = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { 
          _id: "$items.menuItem", 
          totalQuantity: { $sum: "$items.quantity" } 
      }},
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "menuDetails"
      }},
      { $unwind: "$menuDetails" }
    ]);
    res.json(topSellers);
  } catch (error) { next(error); }
};