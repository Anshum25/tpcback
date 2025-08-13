const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tpcDB";

async function listCollections() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(
    "Collections in DB:",
    collections.map((c) => c.name),
  );
  await mongoose.disconnect();
}

listCollections().catch((err) => {
  console.error("Error listing collections:", err);
  process.exit(1);
});
