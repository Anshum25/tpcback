const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String },
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    image: { type: String }, // URL or path
    city: { type: String, enum: ["Ahmedabad", "Gandhinagar", "Vadodara", "Surat"], required: true },
    core: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);
