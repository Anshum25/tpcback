const Analytics = require("../models/Analytics");
const getClientIP = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;

// Ensure singleton analytics document
async function getAnalyticsDoc() {
  let doc = await Analytics.findOne();
  if (!doc) doc = await Analytics.create({});
  return doc;
}

exports.trackPageView = async (req, res, next) => {
  try {
    const analytics = await getAnalyticsDoc();
    analytics.pageViews += 1;
    // Unique visitor tracking
    const ip = getClientIP(req);
    if (!analytics.uniqueVisitorIPs.includes(ip)) {
      analytics.uniqueVisitorIPs.push(ip);
      analytics.uniqueVisitors += 1;
    }
    await analytics.save();
    next();
  } catch (error) {
    next(); // Don't block user if analytics fails
  }
};

exports.trackSession = async (req, res, next) => {
  try {
    const analytics = await getAnalyticsDoc();
    analytics.totalSessions += 1;
    await analytics.save();
    next();
  } catch (error) {
    next();
  }
};

exports.trackSessionDuration = async (durationSeconds) => {
  const analytics = await getAnalyticsDoc();
  analytics.totalSessionDuration += durationSeconds;
  await analytics.save();
};

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await getAnalyticsDoc();
    const avgSession =
      analytics.totalSessions > 0
        ? Math.round(analytics.totalSessionDuration / analytics.totalSessions)
        : 0;
    res.json({
      totalVisitors: analytics.totalVisitors,
      uniqueVisitors: analytics.uniqueVisitors,
      pageViews: analytics.pageViews,
      avgSession: avgSession, // in seconds
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
