const ApiError = require("../utils/apiError");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const response = {
    message: err.message || "Server error",
  };

  if (err.name === "CastError") {
    response.message = "Resource not found";
  }

  if (err.code === 11000) {
    response.message = "Duplicate value already exists";
  }

  if (err.name === "MulterError") {
    err.statusCode = 400;
    response.message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Maximum size is 15 MB."
        : err.message;
  }

  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);

  if (err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  console.error(err);
  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
