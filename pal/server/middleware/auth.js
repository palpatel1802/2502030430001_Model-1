const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const ApiError = require("../utils/apiError");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError(401, "Authentication token is required"));
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return next(new ApiError(401, "User account is not active"));
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    req.currentUser = user;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new ApiError(403, "You do not have permission to perform this action"));
  }

  return next();
};

module.exports = auth;
module.exports.authorize = authorize;
