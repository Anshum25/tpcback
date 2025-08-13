const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  authenticateJWT,
  requireAdmin,
  requireSimpleAdminToken,
} = require("../middleware/auth");
const authController = require("../controllers/authController");

// Protect all admin routes below with requireSimpleAdminToken
router.get("/users", requireSimpleAdminToken, adminController.getAllUsers);

router.post(
  "/change-password",
  requireSimpleAdminToken,
  authController.changeAdminPassword,
);

// Add route for changing admin credentials
router.post(
  "/change-credentials",
  authenticateJWT,
  requireAdmin,
  authController.changeAdminCredentials,
);

module.exports = router;
