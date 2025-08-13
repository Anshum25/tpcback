const express = require("express");
const router = express.Router();
const teamMemberController = require("../controllers/teamMemberController");
const { authenticateJWT, requireAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Multer setup for team member images
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

router.get(
  "/",
  authenticateJWT,
  requireAdmin,
  teamMemberController.getAllTeamMembers,
);
router.get(
  "/:id",
  authenticateJWT,
  requireAdmin,
  teamMemberController.getTeamMember,
);
router.post(
  "/",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  teamMemberController.createTeamMember,
);
router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  teamMemberController.updateTeamMember,
);
router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  teamMemberController.deleteTeamMember,
);

module.exports = router;
