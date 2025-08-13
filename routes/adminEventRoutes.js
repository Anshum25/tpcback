const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticateJWT, requireAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Multer setup for event images
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

// Admin: /api/admin/events
router.post(
  "/",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  eventController.createEvent,
);
router.get("/", authenticateJWT, requireAdmin, eventController.getEvents);
router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  eventController.deleteEvent,
);
router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  eventController.updateEvent,
);
router.get(
  "/:id/participants",
  authenticateJWT,
  requireAdmin,
  eventController.getEventParticipants,
);

module.exports = router;
