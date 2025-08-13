const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    totalVisitors: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    totalSessionDuration: { type: Number, default: 0 }, // in seconds
    uniqueVisitorIPs: { type: [String], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Analytics", analyticsSchema);
