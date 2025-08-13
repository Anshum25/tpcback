const express = require("express");
const router = express.Router();
const textBlockController = require("../controllers/textBlockController");
// const { authenticateJWT, requireAdmin } = require("../middleware/auth");

router.get("/by-title", textBlockController.getTextBlockByTitle);
router.get("/:id", textBlockController.getTextBlock);
router.get(
  "/",
  // authenticateJWT,
  // requireAdmin,
  textBlockController.getAllTextBlocks,
);
router.post(
  "/",
  // authenticateJWT,
  // requireAdmin,
  textBlockController.createTextBlock,
);
router.put(
  "/:id",
  // authenticateJWT,
  // requireAdmin,
  textBlockController.updateTextBlock,
);
router.delete(
  "/:id",
  // authenticateJWT,
  // requireAdmin,
  textBlockController.deleteTextBlock,
);

module.exports = router;
