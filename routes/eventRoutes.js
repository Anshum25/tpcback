const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const teamMemberController = require("../controllers/teamMemberController");
const { authenticateJWT } = require("../middleware/auth");

// Public: GET /api/events
router.get("/", eventController.getEvents);

// Public: POST /:id/register
router.post(
  "/:id/register",
  authenticateJWT,
  eventController.registerUserForEvent
);

// Public: GET /api/team
router.get("/team", teamMemberController.getAllTeamMembersPublic);

// Public: GET /api/events/latest-completed
router.get("/latest-completed", eventController.getLatestCompletedEvents);

module.exports = router;
