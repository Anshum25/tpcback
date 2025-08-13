const Registration = require("../models/Registration");
const City = require("../models/City");

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // 5 registrations per 15 minutes per IP

const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimitMap.set(ip, validRequests);
  
  // Check if limit exceeded
  if (validRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  // Add current request
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  
  return true;
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  for (const [ip, requests] of rateLimitMap.entries()) {
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    if (validRequests.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, validRequests);
    }
  }
}, RATE_LIMIT_WINDOW);

// Public endpoint - create new registration
exports.createRegistration = async (req, res) => {
  try {
    // Rate limiting check
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ 
        message: "Too many registration attempts. Please try again in 15 minutes." 
      });
    }

    let { name, email, phone, city } = req.body;
    
    // Input sanitization
    if (name) name = name.toString().trim().replace(/<[^>]*>/g, '').substring(0, 50);
    if (email) email = email.toString().trim().toLowerCase().replace(/<[^>]*>/g, '').substring(0, 100);
    if (phone) phone = phone.toString().trim().replace(/[^0-9\+\-\(\)\s]/g, '').substring(0, 20);
    if (city) city = city.toString().trim().replace(/<[^>]*>/g, '').substring(0, 50);
    
    // Validate required fields
    if (!name || !email || !phone || !city) {
      return res.status(400).json({ 
        message: "All fields are required",
        errors: {
          name: !name ? "Name is required" : null,
          email: !email ? "Email is required" : null,
          phone: !phone ? "Phone is required" : null,
          city: !city ? "City is required" : null,
        }
      });
    }
    
    // Check if city exists and is active
    const cityExists = await City.findOne({ name: city, isActive: true });
    if (!cityExists) {
      return res.status(400).json({ 
        message: "Invalid city or city is not accepting registrations" 
      });
    }
    
    // Additional validation
    if (name.length < 2) {
      return res.status(400).json({ 
        message: "Name must be at least 2 characters long" 
      });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }
    
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!/^[\+]?[1-9][\d]{9,15}$/.test(cleanPhone)) {
      return res.status(400).json({ 
        message: "Please provide a valid phone number" 
      });
    }

    // Create registration
    const registration = new Registration({
      name,
      email,
      phone,
      city,
    });
    
    await registration.save();
    
    // Increment student count for the city
    await City.findByIdAndUpdate(cityExists._id, {
      $inc: { studentCount: 1 }
    });
    
    res.status(201).json({
      message: "Registration successful! We will contact you soon.",
      registration: {
        _id: registration._id,
        name: registration.name,
        city: registration.city,
        status: registration.status,
        createdAt: registration.createdAt
      }
    });
  } catch (error) {
    console.error("Create Registration Error:", error);
    
    // Handle duplicate registration
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "You have already registered for this city" 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        message: "Validation failed",
        errors
      });
    }
    
    res.status(500).json({ 
      message: "Registration failed. Please try again later." 
    });
  }
};

// Admin endpoint - get all registrations
exports.getAllRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 50, city, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (city) filter.city = city;
    if (status) filter.status = status;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const registrations = await Registration.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Registration.countDocuments(filter);
    
    res.json({
      registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get All Registrations Error:", error);
    res.status(500).json({ 
      message: "Failed to fetch registrations", 
      error: error.message 
    });
  }
};

// Admin endpoint - get registration by ID
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.json(registration);
  } catch (error) {
    console.error("Get Registration Error:", error);
    res.status(500).json({ 
      message: "Failed to fetch registration", 
      error: error.message 
    });
  }
};

// Admin endpoint - update registration
exports.updateRegistration = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (status && !['pending', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be pending, confirmed, or rejected" 
      });
    }
    
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    
    res.json(registration);
  } catch (error) {
    console.error("Update Registration Error:", error);
    res.status(400).json({ 
      message: "Failed to update registration", 
      error: error.message 
    });
  }
};

// Admin endpoint - delete registration
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }
    
    // Decrement student count for the city if registration was confirmed
    if (registration.status === 'confirmed') {
      await City.findOneAndUpdate(
        { name: registration.city },
        { $inc: { studentCount: -1 } }
      );
    }
    
    await Registration.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Delete Registration Error:", error);
    res.status(500).json({ 
      message: "Failed to delete registration", 
      error: error.message 
    });
  }
};

// Admin endpoint - get registrations by city
exports.getRegistrationsByCity = async (req, res) => {
  try {
    const { cityName } = req.params;
    const { page = 1, limit = 50, status } = req.query;
    
    const filter = { city: cityName };
    if (status) filter.status = status;
    
    const registrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Registration.countDocuments(filter);
    
    res.json({
      registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      city: cityName
    });
  } catch (error) {
    console.error("Get Registrations by City Error:", error);
    res.status(500).json({ 
      message: "Failed to fetch registrations", 
      error: error.message 
    });
  }
};

// Admin endpoint - get registrations by status
exports.getRegistrationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 50, city } = req.query;
    
    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be pending, confirmed, or rejected" 
      });
    }
    
    const filter = { status };
    if (city) filter.city = city;
    
    const registrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Registration.countDocuments(filter);
    
    res.json({
      registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      status
    });
  } catch (error) {
    console.error("Get Registrations by Status Error:", error);
    res.status(500).json({ 
      message: "Failed to fetch registrations", 
      error: error.message 
    });
  }
};