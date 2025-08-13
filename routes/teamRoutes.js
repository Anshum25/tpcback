const express = require("express");
const router = express.Router();
const teamMemberController = require("../controllers/teamMemberController");

// Public: GET /api/team
router.get("/", teamMemberController.getAllTeamMembers);

module.exports = router;
