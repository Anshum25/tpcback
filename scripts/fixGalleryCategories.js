const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tpcDB";
const DEFAULT_CATEGORY = "Workshop"; // Change as needed

async function fixGalleryCategories() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const result = await mongoose.connection.db
    .collection("imageassets")
    .updateMany(
      {
        part: "Gallery",
        $or: [{ category: { $exists: false } }, { category: "" }],
      },
      { $set: { category: DEFAULT_CATEGORY } },
    );
  console.log("Updated documents:", result.modifiedCount);
  await mongoose.disconnect();
}

fixGalleryCategories().catch((err) => {
  console.error("Error updating gallery categories:", err);
  process.exit(1);
});
