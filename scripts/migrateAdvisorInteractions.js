// Migration script to add isInteraction field to existing advisors
const mongoose = require('mongoose');
const Advisor = require('../models/Advisor');

const migrateAdvisorInteractions = async () => {
  try {
    console.log('Starting advisor interaction migration...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tpc');
    console.log('Connected to MongoDB');

    // Update all existing advisors to have isInteraction: false (Board of Advisors)
    const result = await Advisor.updateMany(
      { isInteraction: { $exists: false } },
      { $set: { isInteraction: false } }
    );

    console.log(`Migration completed: ${result.modifiedCount} advisors updated`);
    
    // Verify the migration
    const totalAdvisors = await Advisor.countDocuments();
    const boardAdvisors = await Advisor.countDocuments({ isInteraction: false });
    const interactions = await Advisor.countDocuments({ isInteraction: true });
    
    console.log(`Total advisors: ${totalAdvisors}`);
    console.log(`Board advisors: ${boardAdvisors}`);
    console.log(`Interactions: ${interactions}`);
    
    await mongoose.disconnect();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateAdvisorInteractions();
}

module.exports = migrateAdvisorInteractions;