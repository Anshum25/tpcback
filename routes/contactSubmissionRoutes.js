const express = require('express');
const router = express.Router();
const contactSubmissionController = require('../controllers/contactSubmissionController');
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

// Public route for form submission
router.post('/', contactSubmissionController.createSubmission);

// Admin route to get all submissions
router.get('/', authenticateJWT, requireAdmin, contactSubmissionController.getAllSubmissions);

module.exports = router;
