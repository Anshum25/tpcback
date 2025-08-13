const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
const { authenticateJWT, requireAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Multer setup for city images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/cities"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Admin routes for city management
router.get(
  "/",
  authenticateJWT,
  requireAdmin,
  cityController.getAllCities
);

router.get(
  "/:id",
  authenticateJWT,
  requireAdmin,
  cityController.getCityById
);

router.post(
  "/",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  cityController.createCity
);

router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  cityController.updateCity
);

router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  cityController.deleteCity
);

module.exports = router;