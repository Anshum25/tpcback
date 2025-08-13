// Script to create database indexes for advisor filtering optimization
const mongoose = require('mongoose');
const Advisor = require('../models/Advisor');

const createAdvisorIndexes = async () => {
  try {
    console.log('Creating database indexes for advisor optimization...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tpc');
    console.log('Connected to MongoDB');

    // Create index on isInteraction field for efficient filtering
    await Advisor.collection.createIndex({ isInteraction: 1 });
    console.log('✅ Created index on isInteraction field');

    // Create compound index for common queries (name + isInteraction)
    await Advisor.collection.createIndex({ name: 1, isInteraction: 1 });
    console.log('✅ Created compound index on name and isInteraction fields');

    // Create index on createdAt for sorting
    await Advisor.collection.createIndex({ createdAt: -1 });
    console.log('✅ Created index on createdAt field');

    // List all indexes
    const indexes = await Advisor.collection.indexes();
    console.log('\nCurrent indexes:');
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${JSON.stringify(index.key)} - ${index.name}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Failed to create indexes:', error);
    process.exit(1);
  }
};

// Run index creation if called directly
if (require.main === module) {
  createAdvisorIndexes();
}

module.exports = createAdvisorIndexes;