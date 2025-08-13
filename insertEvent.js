const mongoose = require("mongoose");
const Event = require("./models/Event");
require("dotenv").config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const event = new Event({
    title: "Event",
    description: "hii",
    date: "2025-07-09",
    time: "16:00",
    location: "amd",
    participants: 0,
    category: "Debate",
    status: "Upcoming",
  });

  await event.save();
  console.log("Event inserted!");
  await mongoose.disconnect();
}

run();
