const mongoose = require("mongoose");
const Event = require("../models/Event");

const MONGO_URI =
  "mongodb+srv://anshum25052006:bvM2EHVP7hrA21GM@tpc.z8zgugo.mongodb.net/tpcDB?retryWrites=true&w=majority&appName=TPC";

async function fixCompletedEvents() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const events = await Event.find();
  console.log(`Found ${events.length} events.`);
  let updated = 0;
  for (let i = 0; i < events.length; i++) {
    if (events[i].date && !isNaN(new Date(events[i].date).getTime())) {
      events[i].status = "Completed";
      await events[i].save();
      updated++;
      console.log(
        `Updated event: ${events[i].title} -> status: ${events[i].status}, date: ${events[i].date}`,
      );
    }
  }
  await mongoose.disconnect();
  console.log(`Done! Updated ${updated} events.`);
}

// Also update the event with title 'ed' to be completed (date unchanged)
async function fixSpecificEvent() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const event = await Event.findOne({ title: "ed" });
  if (event) {
    event.status = "Completed";
    await event.save();
    console.log(`Updated event 'ed' to Completed (date unchanged)`);
  } else {
    console.log(`Event with title 'ed' not found.`);
  }
  await mongoose.disconnect();
}

// Run the main function
fixCompletedEvents().catch((err) => {
  console.error(err);
  process.exit(1);
});
