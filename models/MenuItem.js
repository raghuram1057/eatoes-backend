const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  category: { 
    type: String, 
    required: true, 
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'] 
  },
  price: { type: Number, required: true, min: 0 },
  ingredients: [String],
  isAvailable: { type: Boolean, default: true },
  preparationTime: { type: Number },
  imageUrl: { type: String },
}, { timestamps: true });

// Create text index for search functionality
menuItemSchema.index({ name: 'text', ingredients: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);