const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");

// Public: POST /api/registrations
router.post("/", registrationController.createRegistration);

module.exports = router;