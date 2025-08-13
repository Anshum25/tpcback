const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const MONGO_URI =
  "mongodb+srv://anshum25052006:bvM2EHVP7hrA21GM@tpc.z8zgugo.mongodb.net/tpcDB?retryWrites=true&w=majority&appName=TPC" ||
  "mongodb://localhost:27017/yourdbname"; // Change as needed
console.log("MONGO_URI", MONGO_URI);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      password: await bcrypt.hash("adminpassword", 10),
      isAdmin: true,
    };

    // Check if admin already exists
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log("Admin user already exists.");
    } else {
      await User.create(adminData);
      console.log("Admin user created.");
    }
  } catch (err) {
    console.error("Error seeding admin user:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedAdmin();
