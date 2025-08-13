const express = require("express");
const router = express.Router();
const advisorController = require("../controllers/advisorController");
const { authenticateJWT, requireAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Multer setup for advisor images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/:id", advisorController.getAdvisor);
router.get("/", advisorController.getAllAdvisors);
router.post(
  "/",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  advisorController.createAdvisor,
);
router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  advisorController.updateAdvisor,
);
router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  advisorController.deleteAdvisor,
);

module.exports = router;
