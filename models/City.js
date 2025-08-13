const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true
    },
    image: { 
      type: String, 
      required: true 
    },
    studentCount: { 
      type: Number, 
      default: 0,
      min: 0
    },
    registrationLink: { 
      type: String,
      trim: true
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

// Add index for frequently queried fields
citySchema.index({ isActive: 1 });
citySchema.index({ name: 1 });

module.exports = mongoose.model("City", citySchema);