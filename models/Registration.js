const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: { 
      type: String, 
      required: true,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    city: { 
      type: String, 
      required: true,
      trim: true
    },
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'rejected'], 
      default: 'pending' 
    },
  },
  { timestamps: true }
);

// Add compound index to prevent duplicate registrations per city
registrationSchema.index({ email: 1, city: 1 }, { unique: true });

// Add indexes for frequently queried fields
registrationSchema.index({ city: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Registration", registrationSchema);