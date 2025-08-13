const Event = require("../models/Event");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dvvi1o4lr",
  api_key: "531673256871499",
  api_secret: "m8ZXW-nxBZYZ_7l7AG_Ckglcdz4",
});

exports.createEvent = async (req, res) => {
  try {
    // Backend validation for required fields
    const requiredFields = [
      "title",
      "description",
      "date",
      "time",
      "location",
      "category",
      "status",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }
    let eventData = { ...req.body };
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-events",
        resource_type: "image",
      });
      eventData.image = result.secure_url;
    }
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error);
    res
      .status(400)
      .json({ message: "Failed to create event", error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate("registeredUsers", "name email _id");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete event", error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    // Backend validation for required fields
    const requiredFields = [
      "title",
      "description",
      "date",
      "time",
      "location",
      "category",
      "status",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ message: `Missing required field: ${field}` });
      }
    }
    let updateData = { ...req.body };
    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "tpc-events",
        resource_type: "image",
      });
      updateData.image = result.secure_url;
    } else {
      // Do not include image in updateData if no file is uploaded
      delete updateData.image;
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(event);
  } catch (error) {
    console.error("Update Event Error:", error);
    res
      .status(500)
      .json({ message: "Failed to update event", error: error.message });
  }
};

// Register a user for an event
exports.registerUserForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.userId;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }
    event.registeredUsers.push(userId);
    event.participants = event.registeredUsers.length;
    await event.save();
    res.json({ message: "Registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register", error: error.message });
  }
};

// Admin: Get registered users for an event
exports.getEventParticipants = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate(
      "registeredUsers",
      "name email"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ participants: event.registeredUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch participants", error: error.message });
  }
};

exports.getLatestCompletedEvents = async (req, res) => {
  try {
    const now = new Date();
    // Get all completed events
    const events = await Event.find({
      status: { $regex: /^completed$/i },
    });

    // Debug: log all completed events
    

    // Filter in JS: only include events whose date+time is in the past
    const completed = events.filter((e) => {
      if (!e.date || !e.time) return false;
      const eventDateTime = new Date(`${e.date}T${e.time}`);
      return eventDateTime <= now;
    });

    // Shuffle the completed events array
    for (let i = completed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [completed[i], completed[j]] = [completed[j], completed[i]];
    }

    // Take the first 3 random events
    const randomCompleted = completed.slice(0, 3);

    // Debug: log filtered random completed events
    
    res.json(randomCompleted);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch latest completed events" });
  }
};
