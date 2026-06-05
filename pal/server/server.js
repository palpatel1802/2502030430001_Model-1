const express = require("express");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const connectDatabase = require("./config/database");
const env = require("./config/env");
const logger = require("./middleware/logger");
const { securityHeaders, rateLimiter, sanitizeRequest } = require("./middleware/security");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(securityHeaders);
app.use(
  cors({
    origin: env.corsOrigin === "*" ? "*" : env.corsOrigin.split(","),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(compression());
app.use(rateLimiter);
app.use(sanitizeRequest);
app.use(logger);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.toLowerCase().endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
      }
    },
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "StudyHub API Server",
    version: "1.0.0",
    environment: env.nodeEnv,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/search", require("./routes/search"));

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Unable to start StudyHub API", error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
