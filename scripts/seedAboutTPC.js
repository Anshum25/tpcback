// Script to insert About TPC text block into the database
const mongoose = require('mongoose');
const TextBlock = require('../models/TextBlock');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tpc';

const aboutTPC = {
  title: 'About TPC',
  value: `The Turning Point Community (TPC) stands as India's largest and most dynamic student-run society, dedicated to empowering youth through intellectually enriching platforms.\n\nWe organize diverse events including high-stakes debate competitions, MUNited Nations (MUNs), state-level Speaker Sessions, and skill-building workshops that bring together over 10,000 students.`
};

async function seed() {
  await mongoose.connect(MONGO_URI);
  const existing = await TextBlock.findOne({ title: aboutTPC.title });
  if (existing) {
    existing.value = aboutTPC.value;
    await existing.save();
    console.log('Updated About TPC text block.');
  } else {
    await TextBlock.create(aboutTPC);
    console.log('Inserted About TPC text block.');
  }
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
