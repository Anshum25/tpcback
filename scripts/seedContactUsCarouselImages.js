// Script to seed Contact Us carousel images
const mongoose = require('mongoose');
const ImageAsset = require('../models/ImageAsset');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const placeholderUrls = [
  'https://res.cloudinary.com/demo/image/upload/v1690000000/placeholder1.jpg',
  'https://res.cloudinary.com/demo/image/upload/v1690000000/placeholder2.jpg',
  'https://res.cloudinary.com/demo/image/upload/v1690000000/placeholder3.jpg',
];

const parts = [
  'Contact Us Carousel 1',
  'Contact Us Carousel 2',
  'Contact Us Carousel 3',
];

async function seedContactUsCarouselImages() {
  await mongoose.connect(MONGO_URI);
  for (let i = 0; i < 3; i++) {
    await ImageAsset.findOneAndUpdate(
      { part: parts[i] },
      {
        title: parts[i],
        url: placeholderUrls[i],
        alt: parts[i],
        part: parts[i],
        category: 'Contact Us Carousel',
      },
      { upsert: true, new: true }
    );
  }
  await mongoose.disconnect();
  console.log('Seeded Contact Us carousel images successfully.');
}

seedContactUsCarouselImages().catch(e => {
  console.error(e);
  mongoose.disconnect();
});
