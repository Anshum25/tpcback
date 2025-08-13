// Script to fix all event dates to YYYY-MM-DD format
const mongoose = require("mongoose");
const Event = require("../models/Event");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tpc"; // Update if needed

function toISODateString(dateStr) {
  // Try to parse as YYYY-MM-DD first
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Try to parse as DD-MM-YYYY or other common formats
  const parts = dateStr.trim().split(/[-/]/);
  if (parts.length === 3) {
    // If year is first, assume correct
    if (parts[0].length === 4)
      return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
    // If year is last, convert
    if (parts[2].length === 4)
      return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  // Fallback: try Date parsing
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return dateStr; // If all else fails, return as is
}

async function fixDates() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const events = await Event.find();
  let updated = 0;
  for (const event of events) {
    const fixedDate = toISODateString(event.date);
    if (fixedDate !== event.date) {
      event.date = fixedDate;
      await event.save();
      updated++;
      console.log(`Fixed event: ${event.title} | New date: ${fixedDate}`);
    }
  }
  console.log(`\nDone. Updated ${updated} events.`);
  await mongoose.disconnect();
}

fixDates().catch((err) => {
  console.error("Error fixing event dates:", err);
  process.exit(1);
});
