const mongoose = require("mongoose");

const ImageAssetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  alt: { type: String },
  part: { type: String, required: true }, // e.g., 'Homepage Hero', 'Team Photo', etc.
  event: { type: String },
  date: { type: String },
  location: { type: String },
  category: { type: String }, // e.g., 'Debate', 'MUN', etc.
});

module.exports = mongoose.model("ImageAsset", ImageAssetSchema);
