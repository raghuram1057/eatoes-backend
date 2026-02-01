const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

dotenv.config();

const sampleMenuItems = [
  // Appetizers
  { name: "Crispy Spring Rolls", category: "Appetizer", price: 8, ingredients: ["Cabbage", "Carrot", "Flour"], isAvailable: true, preparationTime: 10 },
  { name: "Spicy Chicken Wings", category: "Appetizer", price: 12, ingredients: ["Chicken", "Hot Sauce"], isAvailable: true, preparationTime: 15 },
  { name: "Garlic Bruschetta", category: "Appetizer", price: 7, ingredients: ["Bread", "Garlic", "Tomato"], isAvailable: true, preparationTime: 8 },
  { name: "Stuffed Mushrooms", category: "Appetizer", price: 10, ingredients: ["Mushrooms", "Cheese", "Herbs"], isAvailable: false, preparationTime: 12 },

  // Main Courses
  { name: "Classic Cheeseburger", category: "Main Course", price: 15, ingredients: ["Beef", "Cheese", "Bun"], isAvailable: true, preparationTime: 15 },
  { name: "Grilled Salmon", category: "Main Course", price: 22, ingredients: ["Salmon", "Lemon", "Asparagus"], isAvailable: true, preparationTime: 20 },
  { name: "Pasta Carbonara", category: "Main Course", price: 18, ingredients: ["Pasta", "Egg", "Bacon"], isAvailable: true, preparationTime: 12 },
  { name: "Mushroom Risotto", category: "Main Course", price: 17, ingredients: ["Rice", "Mushrooms", "Parmesan"], isAvailable: true, preparationTime: 25 },
  { name: "BBQ Pork Ribs", category: "Main Course", price: 25, ingredients: ["Pork", "BBQ Sauce"], isAvailable: true, preparationTime: 30 },

  // Desserts
  { name: "Chocolate Lava Cake", category: "Dessert", price: 9, ingredients: ["Chocolate", "Sugar", "Butter"], isAvailable: true, preparationTime: 15 },
  { name: "NY Cheesecake", category: "Dessert", price: 8, ingredients: ["Cream Cheese", "Graham Cracker"], isAvailable: true, preparationTime: 5 },
  { name: "Tiramisu", category: "Dessert", price: 10, ingredients: ["Coffee", "Mascarpone", "Ladyfingers"], isAvailable: true, preparationTime: 10 },

  // Beverages
  { name: "Iced Americano", category: "Beverage", price: 4, ingredients: ["Coffee", "Water"], isAvailable: true, preparationTime: 3 },
  { name: "Fresh Lemonade", category: "Beverage", price: 5, ingredients: ["Lemon", "Sugar", "Water"], isAvailable: true, preparationTime: 4 },
  { name: "Mango Smoothie", category: "Beverage", price: 6, ingredients: ["Mango", "Yogurt"], isAvailable: true, preparationTime: 5 }
];

// Helper: Generate unique order numbers
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

const seedDB = async () => {
  try {
    // Ensure correct env variable name
    const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!dbURI) {
      console.error("❌ ERROR: MONGODB_URI not found in .env");
      process.exit(1);
    }

    await mongoose.connect(dbURI);
    console.log("Connected to DB for seeding...");

    // Clear old data
    await MenuItem.deleteMany({});
    await Order.deleteMany({});

    console.log("🧹 Cleared old MenuItems & Orders");

    // Insert Menu Items
    const menuItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`✅ Seeded ${menuItems.length} Menu Items`);

    // Create sample orders with UNIQUE ORDER NUMBERS
    const sampleOrders = [
      {
        orderNumber: generateOrderNumber(),
        customerName: "Alice Johnson",
        tableNumber: 4,
        status: "Delivered",
        items: [
          { menuItem: menuItems[4]._id, quantity: 2, price: menuItems[4].price },
          { menuItem: menuItems[12]._id, quantity: 1, price: menuItems[12].price }
        ],
        totalAmount: (menuItems[4].price * 2) + menuItems[12].price
      },
      {
        orderNumber: generateOrderNumber(),
        customerName: "Bob Smith",
        tableNumber: 2,
        status: "Preparing",
        items: [
          { menuItem: menuItems[5]._id, quantity: 1, price: menuItems[5].price }
        ],
        totalAmount: menuItems[5].price
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`✅ Seeded ${sampleOrders.length} Sample Orders`);

    console.log("🌱 Database Seeding Complete!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();
