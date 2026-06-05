const env = require("../config/env");

const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.path.startsWith("/uploads")) {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.removeHeader("Content-Security-Policy");
  } else {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Content-Security-Policy", "default-src 'self'");
  }
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};

const requestCounts = new Map();

const rateLimiter = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const current = requestCounts.get(key) || { count: 0, resetAt: now + env.rateLimitWindowMs };

  if (current.resetAt < now) {
    current.count = 0;
    current.resetAt = now + env.rateLimitWindowMs;
  }

  current.count += 1;
  requestCounts.set(key, current);

  res.setHeader("RateLimit-Limit", env.rateLimitMax);
  res.setHeader("RateLimit-Remaining", Math.max(env.rateLimitMax - current.count, 0));

  if (current.count > env.rateLimitMax) {
    return res.status(429).json({ message: "Too many requests. Please try again later." });
  }

  return next();
};

const sanitizeInput = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeInput);
  }

  if (value && typeof value === "object") {
    return Object.keys(value).reduce((cleaned, key) => {
      const safeKey = key.replace(/\$/g, "").replace(/\./g, "");
      cleaned[safeKey] = sanitizeInput(value[key]);
      return cleaned;
    }, {});
  }

  return value;
};

const sanitizeRequest = (req, res, next) => {
  req.body = sanitizeInput(req.body);
  req.query = sanitizeInput(req.query);
  req.params = sanitizeInput(req.params);
  next();
};

module.exports = { securityHeaders, rateLimiter, sanitizeRequest };
