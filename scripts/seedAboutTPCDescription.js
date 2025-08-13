// Script to seed About TPC Description text block
const mongoose = require('mongoose');
const TextBlock = require('../models/TextBlock');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  await mongoose.connect(MONGO_URI);
  const description = `This is a random About TPC description. You can edit this later from the admin panel.`;
  await TextBlock.findOneAndUpdate(
    { title: 'About TPC Description' },
    { value: description },
    { upsert: true, new: true }
  );
  await mongoose.disconnect();
  console.log('Seeded About TPC Description text block.');
};

run().catch(e => { console.error(e); process.exit(1); });
