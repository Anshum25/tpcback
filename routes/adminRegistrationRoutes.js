const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const { authenticateJWT, requireAdmin } = require("../middleware/auth");

// Admin routes for registration management
router.get(
  "/",
  authenticateJWT,
  requireAdmin,
  registrationController.getAllRegistrations
);

router.get(
  "/:id",
  authenticateJWT,
  requireAdmin,
  registrationController.getRegistrationById
);

router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  registrationController.updateRegistration
);

router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  registrationController.deleteRegistration
);

// Get registrations by city
router.get(
  "/city/:cityName",
  authenticateJWT,
  requireAdmin,
  registrationController.getRegistrationsByCity
);

// Get registrations by status
router.get(
  "/status/:status",
  authenticateJWT,
  requireAdmin,
  registrationController.getRegistrationsByStatus
);

module.exports = router;