const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { trackPageView } = require("./controllers/analyticsController");
const path = require("path");
const TextBlock = require("./models/TextBlock");
const fs = require("fs");
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

dotenv.config();

const app = express();

// Middleware
app.use(cors());
// Do NOT use express.json() globally!
// Only use express.json() for routes that expect JSON, not for file upload routes

app.use("/api/auth", express.json(), require("./routes/authRoutes"));
app.use("/api/events", express.json(), require("./routes/eventRoutes"));
app.use(
  "/api/admin/events",
  express.json(),
  require("./routes/adminEventRoutes"),
);
app.use(
  "/api/admin/texts",
  express.json(),
  require("./routes/textBlockRoutes"),
);
app.use(
  "/api/admin/advisors",
  express.json(),
  require("./routes/advisorRoutes"),
);
app.use(
  "/api/admin/analytics",
  express.json(),
  require("./routes/analyticsRoutes"),
);
// Do NOT use express.json() for /api/admin/team or /api/admin/images
app.use("/api/admin/team", require("./routes/teamMemberRoutes"));
app.use("/api/admin/images", require("./routes/imageAssetRoutes"));
app.use("/api/team", require("./routes/teamRoutes"));
app.use("/api/cities", require("./routes/cityRoutes"));
app.use("/api/admin/cities", require("./routes/adminCityRoutes"));
app.use("/api/registrations", express.json(), require("./routes/registrationRoutes"));
app.use("/api/admin/registrations", express.json(), require("./routes/adminRegistrationRoutes"));

// Track analytics for all GET requests (public pages)
app.use((req, res, next) => {
  if (req.method === "GET") {
    trackPageView(req, res, next);
  } else {
    next();
  }
});

// Routes
app.use(
  "/api/contact-submissions",
  express.json(),
  require("./routes/contactSubmissionRoutes")
);
app.use("/api/auth", require("./routes/authRoutes"));
// Add express.json() for /api/admin routes that expect JSON (like change-credentials)
app.use("/api/admin", express.json(), require("./routes/adminRoutes"));
app.use("/api/admin", require("./routes/analyticsRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/admin/events", require("./routes/adminEventRoutes"));
app.use("/api/admin/texts", require("./routes/textBlockRoutes"));
app.use("/api/admin/team", require("./routes/teamMemberRoutes"));
app.use("/api/admin/advisors", require("./routes/advisorRoutes"));
app.use("/uploads", express.static(uploadsPath));
app.use("/api/admin/images", require("./routes/imageAssetRoutes"));

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/admin/texts/test", async (req, res) => {
  console.log("[TEST ROUTE] Fetching text blocks...");
  try {
    const blocks = await TextBlock.find();
    console.log("[TEST ROUTE] Found blocks:", blocks);
    res.json(blocks);
  } catch (error) {
    console.error("[TEST ROUTE] Error fetching text blocks:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch text blocks", error: error.message });
  }
});

// Connect to DB and start server
const PORT = 5001;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
