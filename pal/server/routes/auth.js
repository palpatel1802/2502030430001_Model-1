const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const { signToken, authResponse } = require("../utils/tokens");

const router = express.Router();

const registerSchema = {
  firstName: { required: true, maxLength: 80 },
  lastName: { required: true, maxLength: 80 },
  email: { required: true, type: "email" },
  password: { required: true, minLength: 8 },
};

const loginSchema = {
  email: { required: true, type: "email" },
  password: { required: true },
};

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, course, semester, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      course,
      semester,
      role: role === "instructor" ? "instructor" : "student",
    });

    const token = signToken(user);
    res.status(201).json({
      message: "User registered successfully",
      ...authResponse(user, token),
    });
  })
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (!user.isActive) {
      throw new ApiError(401, "User account is not active");
    }

    const token = signToken(user);
    res.json({
      message: "Login successful",
      ...authResponse(user, token),
    });
  })
);

router.get(
  "/me",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate("savedNotes", "title subject semester")
      .populate("downloadedNotes", "title subject semester");

    res.json(user);
  })
);

module.exports = router;
