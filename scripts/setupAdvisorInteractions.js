// Combined script to migrate existing advisors and seed sample interactions
const migrateAdvisorInteractions = require('./migrateAdvisorInteractions');
const seedInteractionAdvisors = require('./seedInteractionAdvisors');

const setupAdvisorInteractions = async () => {
  try {
    console.log('=== Setting up Advisor Interactions Feature ===\n');
    
    // Step 1: Run migration
    console.log('Step 1: Running migration...');
    await migrateAdvisorInteractions();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Step 2: Seed sample data
    console.log('Step 2: Seeding sample interaction advisors...');
    await seedInteractionAdvisors();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Advisor Interactions feature setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Restart your backend server');
    console.log('2. Visit the admin panel to manage advisors');
    console.log('3. Check the Board of Advisors page to see both sections');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupAdvisorInteractions();
}

module.exports = setupAdvisorInteractions;