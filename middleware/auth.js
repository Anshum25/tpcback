const jwt = require("jsonwebtoken");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
};

// Simple admin token middleware
exports.requireSimpleAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader === "admin-token") {
    return next();
  }
  return res
    .status(401)
    .json({ message: "Unauthorized: Invalid or missing admin token" });
};
