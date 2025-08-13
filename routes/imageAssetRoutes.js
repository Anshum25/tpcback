const express = require("express");
const router = express.Router();
const imageAssetController = require("../controllers/imageAssetController");
const { authenticateJWT, requireAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Public: GET /gallery (move to top to guarantee public access)
router.get("/gallery", imageAssetController.getGalleryImages);

// Public: GET /carousel (no authentication required)
router.get("/carousel", imageAssetController.getCarouselImages);

// Set up multer for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.get("/", imageAssetController.getAllImages);
router.get("/:id", imageAssetController.getImage);
router.post(
  "/",
  authenticateJWT,
  requireAdmin,
  upload.single("file"),
  imageAssetController.createImage,
);
router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  upload.single("file"),
  imageAssetController.updateImage,
);
router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  imageAssetController.deleteImage,
);

module.exports = router;
