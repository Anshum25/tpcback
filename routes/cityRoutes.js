const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

// Public: GET /api/cities
router.get("/", cityController.getActiveCities);

module.exports = router;