// backend/scripts/seedTeam.js
const mongoose = require("mongoose");
const TeamMember = require("../models/TeamMember");
require("dotenv").config(); // Loads .env from backend/

const team = [
  {
    name: "Aditya Bhatt",
    position: "President & Founder",
    description: "Empowering Gujarat's youth through leadership and debate.",
  },
  {
    name: "Kavya Chokshi",
    position: "Vice President",
    description: "Oversees events and operations across Gujarat.",
  },
  {
    name: "Dev Babani",
    position: "Secretary General",
    description: "Coordinates partnerships and manages TPC affairs.",
  },
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set in .env");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await TeamMember.deleteMany({});
    await TeamMember.insertMany(team);
    console.log("Seeded core team!");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
