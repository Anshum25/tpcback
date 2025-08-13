const express = require("express");
const router = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const { authenticateJWT, requireAdmin } = require("../middleware/auth");

router.get("/analytics", authenticateJWT, requireAdmin, getAnalytics);

module.exports = router;
