const ImageAsset = require("../models/ImageAsset");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dvvi1o4lr",
  api_key: "531673256871499",
  api_secret: "m8ZXW-nxBZYZ_7l7AG_Ckglcdz4",
});

exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageAsset.find();
    res.json(images);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch images", error: error.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await ImageAsset.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json(image);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch image", error: error.message });
  }
};

exports.createImage = async (req, res) => {
  try {
    console.log("--- [createImage] Incoming request ---");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    const { title, alt, part, event, date, location, category, youtube } = req.body;
    let url = undefined;
    // Accept YouTube link as url if provided
    if (youtube && youtube.trim() !== "") {
      url = youtube.trim();
      console.log('[DEBUG] Using YouTube link as url:', url);
    }
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-images",
        resource_type: "image",
      });
      url = result.secure_url;
      console.log('[DEBUG] Using uploaded file as url:', url);
    }
    if (!part) {
      console.log("[createImage] Missing 'part' field");
      return res.status(400).json({ message: "'part' field is required" });
    }
    if (!url) {
      // Debug log to help diagnose
      console.log('[DEBUG] url is missing. youtube:', youtube, 'file:', req.file, 'url:', url, 'body:', req.body);
      return res.status(400).json({ message: "Image file or YouTube link is required (debug: url missing)" });
    }
    if (!title) {
      console.log("[createImage] Missing 'title' field");
      return res.status(400).json({ message: "'title' field is required" });
    }
    // Only error if both file and youtube link are missing
    if (!url) {
      console.log("[createImage] Missing file upload or YouTube link");
      return res.status(400).json({ message: "Image file or YouTube link is required" });
    }
    const image = new ImageAsset({
      title,
      url,
      alt,
      part,
      event,
      date,
      location,
      category,
    });
    await image.save();
    console.log("[createImage] Image saved:", image);
    res.status(201).json(image);
  } catch (error) {
    console.error("[createImage] Error:", error);
    res
      .status(400)
      .json({ message: "Failed to create image", error: error.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const { title, alt, part, event, date, location, category } = req.body;
    let url = req.body.url;
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-images",
        resource_type: "image",
      });
      url = result.secure_url;
    }
    if (!part) {
      return res.status(400).json({ message: "'part' field is required" });
    }
    const image = await ImageAsset.findByIdAndUpdate(
      req.params.id,
      { title, url, alt, part, event, date, location, category },
      { new: true }
    );
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json(image);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update image", error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await ImageAsset.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete image", error: error.message });
  }
};

exports.getGalleryImages = async (req, res) => {
  try {
    const images = await ImageAsset.find({ part: "Gallery" });
    res.json(images);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gallery images",
      error: error.message,
    });
  }
};

exports.getCarouselImages = async (req, res) => {
  try {
    const images = await ImageAsset.find({ 
      part: { $regex: /homepage carousel/i } // Case-insensitive match for "homepage carousel"
    }).sort({ createdAt: 1 }); // Oldest first for consistent ordering
    res.json(images);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch carousel images",
      error: error.message,
    });
  }
};
