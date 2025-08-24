// Seed script to create sample interaction advisors
const mongoose = require('mongoose');
const Advisor = require('../models/Advisor');

const sampleInteractions = [
  {
    name: 'Dr. Sarah Johnson',
    title: 'Community Partnership Director',
    organization: 'India Education Foundation',
    description: 'Leading collaborative initiatives between educational institutions and Community organizations.',
    expertise: ['Community Engagement', 'Educational Partnerships', 'Social Impact'],
    isInteraction: true,
  },
  {
    name: 'Rajesh Patel',
    title: 'Youth Development Coordinator',
    organization: 'Ahmedabad Youth Council',
    description: 'Facilitating youth leadership programs and Community service projects across India.',
    expertise: ['Youth Leadership', 'Community Service', 'Program Development'],
    isInteraction: true,
  },
  {
    name: 'Prof. Meera Shah',
    title: 'Academic Collaboration Lead',
    organization: 'India University Network',
    description: 'Coordinating inter-university debate competitions and academic exchange programs.',
    expertise: ['Academic Collaboration', 'Debate Coaching', 'Student Exchange'],
    isInteraction: true,
  },
];

const seedInteractionAdvisors = async () => {
  try {
    console.log('Starting interaction advisors seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tpc');
    console.log('Connected to MongoDB');

    // Check if interaction advisors already exist
    const existingInteractions = await Advisor.countDocuments({ isInteraction: true });
    if (existingInteractions > 0) {
      console.log(`${existingInteractions} interaction advisors already exist. Skipping seeding.`);
      await mongoose.disconnect();
      return;
    }

    // Create sample interaction advisors
    const createdAdvisors = await Advisor.insertMany(sampleInteractions);
    console.log(`Successfully created ${createdAdvisors.length} interaction advisors`);

    // Display summary
    const totalAdvisors = await Advisor.countDocuments();
    const boardAdvisors = await Advisor.countDocuments({ isInteraction: false });
    const interactions = await Advisor.countDocuments({ isInteraction: true });
    
    console.log(`\nDatabase Summary:`);
    console.log(`Total advisors: ${totalAdvisors}`);
    console.log(`Board advisors: ${boardAdvisors}`);
    console.log(`Interactions: ${interactions}`);
    
    await mongoose.disconnect();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedInteractionAdvisors();
}

module.exports = seedInteractionAdvisors;