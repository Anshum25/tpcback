const Advisor = require("../models/Advisor");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dvvl04ir",
  api_key: "531673256871499",
  api_secret: "m8ZXW-nxBZYZ_7l7AG_Ckglcdz4",
});

exports.getAllAdvisors = async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};
    
    // Filter by type if specified
    if (type === 'board') {
      filter.isInteraction = false;
    } else if (type === 'interaction') {
      filter.isInteraction = true;
    }
    // If no type specified, return all advisors
    
    const advisors = await Advisor.find(filter);
    res.json(advisors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch advisors", error: error.message });
  }
};

exports.getAdvisor = async (req, res) => {
  try {
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) return res.status(404).json({ message: "Advisor not found" });
    res.json(advisor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch advisor", error: error.message });
  }
};

exports.createAdvisor = async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);
    console.log("REQ BODY:", req.body);
    let advisorData = { ...req.body };
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-advisors",
        resource_type: "image",
      });
      advisorData.image = result.secure_url;
    }
    // Parse expertise if it's a string
    if (typeof advisorData.expertise === "string") {
      advisorData.expertise = advisorData.expertise
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    
    // Handle isInteraction field - convert string to boolean if needed
    if (typeof advisorData.isInteraction === "string") {
      advisorData.isInteraction = advisorData.isInteraction === "true";
    }
    const advisor = new Advisor(advisorData);
    await advisor.save();
    res.status(201).json(advisor);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create advisor", error: error.message });
  }
};

exports.updateAdvisor = async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);
    console.log("REQ BODY:", req.body);
    let updateData = { ...req.body };
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-advisors",
        resource_type: "image",
      });
      updateData.image = result.secure_url;
    }
    // Parse expertise if it's a string
    if (typeof updateData.expertise === "string") {
      updateData.expertise = updateData.expertise
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    
    // Handle isInteraction field - convert string to boolean if needed
    if (typeof updateData.isInteraction === "string") {
      updateData.isInteraction = updateData.isInteraction === "true";
    }
    // Remove empty string fields so they don't overwrite existing data
    Object.keys(updateData).forEach(
      (key) => updateData[key] === "" && delete updateData[key]
    );
    const advisor = await Advisor.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
      }
    );
    if (!advisor) return res.status(404).json({ message: "Advisor not found" });
    res.json(advisor);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update advisor", error: error.message });
  }
};

exports.deleteAdvisor = async (req, res) => {
  try {
    await Advisor.findByIdAndDelete(req.params.id);
    res.json({ message: "Advisor deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete advisor", error: error.message });
  }
};
