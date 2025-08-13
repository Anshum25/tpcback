const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const JWT_SECRET = process.env.JWT_SECRET;
const Otp = require('../models/Otp');
const { sendOTPEmail } = require('../utils/mailer');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email, oass", password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const payload = {
      userId: user._id,
      email: user.email,
      isAdmin: user.email === ADMIN_EMAIL,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.email === ADMIN_EMAIL,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new password are required." });
    }
    const admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found." });
    }
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to change password", error: error.message });
  }
};

exports.changeAdminCredentials = async (req, res) => {
  try {
    const { currentPassword, newPassword, newEmail } = req.body;
    if (!currentPassword || (!newPassword && !newEmail)) {
      return res.status(400).json({
        message: "Current password and at least one new value are required.",
      });
    }
    // Find the admin user (assuming only one admin, or by role/email)
    const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      return res.status(404).json({ message: "Admin user not found." });
    }
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }
    // Update email if provided
    if (newEmail && newEmail !== admin.email) {
      // Check if new email is already taken
      const existing = await User.findOne({ email: newEmail });
      if (existing) {
        return res.status(409).json({ message: "Email already exists." });
      }
      admin.email = newEmail;
    }
    // Update password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
    }
    await admin.save();
    res.json({ message: "Admin credentials updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to change credentials", error: error.message });
  }
};

// --- OTP for password change ---
// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
  try {
    // Only allow one valid OTP at a time
    await Otp.deleteMany({});
    const otp = generateOTP();
    await new Otp({ otp }).save();
    await sendOTPEmail(otp);
    res.json({ message: 'OTP sent to official.turningpointcommunity@gmail.com' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

// POST /api/auth/verify-otp-and-change-password
exports.verifyOtpAndChangePassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    if (!otp || !newPassword) {
      return res.status(400).json({ message: 'OTP and new password are required.' });
    }
    const otpDoc = await Otp.findOne({ otp });
    if (!otpDoc) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    // Delete OTP after use
    await Otp.deleteMany({});
    // Change admin password
    const admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};
