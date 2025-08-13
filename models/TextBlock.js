const mongoose = require("mongoose");

const textBlockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TextBlock", textBlockSchema);
