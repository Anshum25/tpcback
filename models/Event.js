const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    participants: { type: Number, default: 0 },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
    image: { type: String }, // URL to event image
    registrationLink: { type: String }, // URL to registration page
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
