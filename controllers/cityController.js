const City = require("../models/City");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: "dvvi1o4lr",
  api_key: "531673256871499",
  api_secret: "m8ZXW-nxBZYZ_7l7AG_Ckglcdz4",
});

// Ensure cities upload directory exists
const citiesUploadPath = path.join(__dirname, "../uploads/cities");
if (!fs.existsSync(citiesUploadPath)) {
  fs.mkdirSync(citiesUploadPath, { recursive: true });
}

// Public endpoint - get all active cities
exports.getActiveCities = async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });
    res.json(cities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cities", error: error.message });
  }
};

// Admin endpoint - get all cities
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.json(cities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cities", error: error.message });
  }
};

// Admin endpoint - get city by ID
exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch city", error: error.message });
  }
};

// Admin endpoint - create new city
exports.createCity = async (req, res) => {
  console.log("Create City - BODY:", req.body);
  console.log("Create City - FILE:", req.file);
  
  try {
    let cityData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-cities",
        resource_type: "image",
      });
      cityData.image = result.secure_url;
      
      // Clean up local file
      fs.unlinkSync(req.file.path);
    } else {
      return res.status(400).json({ message: "City image is required" });
    }
    
    // Convert studentCount to number if provided
    if (cityData.studentCount) {
      cityData.studentCount = parseInt(cityData.studentCount);
    }
    
    // Convert isActive to boolean if provided
    if (cityData.isActive !== undefined) {
      cityData.isActive = cityData.isActive === 'true' || cityData.isActive === true;
    }
    
    const city = new City(cityData);
    await city.save();
    res.status(201).json(city);
  } catch (error) {
    console.error("Create City Error:", error);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "City name already exists" });
    }
    
    res
      .status(400)
      .json({ message: "Failed to create city", error: error.message });
  }
};

// Admin endpoint - update city
exports.updateCity = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-cities",
        resource_type: "image",
      });
      updateData.image = result.secure_url;
      
      // Clean up local file
      fs.unlinkSync(req.file.path);
    }
    
    // Convert studentCount to number if provided
    if (updateData.studentCount !== undefined) {
      updateData.studentCount = parseInt(updateData.studentCount);
    }
    
    // Convert isActive to boolean if provided
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }
    
    // Remove empty string fields so they don't overwrite existing data
    Object.keys(updateData).forEach(
      (key) => updateData[key] === "" && delete updateData[key]
    );
    
    const city = await City.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    
    res.json(city);
  } catch (error) {
    console.error("Update City Error:", error);
    
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: "City name already exists" });
    }
    
    res
      .status(400)
      .json({ message: "Failed to update city", error: error.message });
  }
};

// Admin endpoint - delete city
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    
    res.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Delete City Error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete city", error: error.message });
  }
};