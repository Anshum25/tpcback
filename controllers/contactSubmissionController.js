const ContactSubmission = require('../models/ContactSubmission');

// Create a new contact submission
exports.createSubmission = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const submission = new ContactSubmission({ name, email, phone, subject, message });
    await submission.save();
    res.status(201).json({ message: 'Submission received', submission });
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit', error: error.message });
  }
};

// Get all submissions
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};
