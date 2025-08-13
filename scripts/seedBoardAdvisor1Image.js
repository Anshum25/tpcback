// Script to seed Board of Advisors 1 image asset
const mongoose = require('mongoose');
const ImageAsset = require('../models/ImageAsset');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  await mongoose.connect(MONGO_URI);
  const placeholderUrl = 'https://res.cloudinary.com/demo/image/upload/v1690000000/placeholder.jpg'; // Replace with your own placeholder if needed
  await ImageAsset.findOneAndUpdate(
    { part: 'Board of Advisors 1' },
    {
      title: 'Board of Advisors 1',
      alt: 'Board of Advisors 1',
      url: placeholderUrl,
      part: 'Board of Advisors 1',
    },
    { upsert: true, new: true }
  );
  await mongoose.disconnect();
  console.log('Seeded Board of Advisors 1 image asset.');
};

run().catch(e => { console.error(e); process.exit(1); });
