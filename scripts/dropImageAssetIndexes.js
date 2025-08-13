// Script to drop all indexes from the imageassets collection
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tpcDB";

async function dropIndexes() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const result = await mongoose.connection.db
    .collection("imageassets")
    .dropIndexes();
  console.log("Dropped indexes:", result);
  await mongoose.disconnect();
}

dropIndexes().catch((err) => {
  console.error("Error dropping indexes:", err);
  process.exit(1);
});
