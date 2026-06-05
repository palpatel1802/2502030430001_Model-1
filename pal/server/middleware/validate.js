const ApiError = require("../utils/apiError");

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));

const validate = (schema) => (req, res, next) => {
  const errors = [];

  Object.entries(schema).forEach(([field, rules]) => {
    const value = req.body[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      return;
    }

    if (value === undefined || value === null || value === "") return;

    if (rules.type === "email" && !isEmail(value)) errors.push(`${field} must be a valid email`);
    if (rules.type === "number" && Number.isNaN(Number(value))) errors.push(`${field} must be a number`);
    if (rules.type === "array" && !Array.isArray(value)) errors.push(`${field} must be an array`);
    if (rules.minLength && String(value).length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`);
    }
    if (rules.maxLength && String(value).length > rules.maxLength) {
      errors.push(`${field} must be at most ${rules.maxLength} characters`);
    }
  });

  if (errors.length) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  return next();
};

module.exports = validate;
