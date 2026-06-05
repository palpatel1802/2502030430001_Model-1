const express = require("express");
const User = require("../models/User");
const Note = require("../models/Note");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

const router = express.Router();

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("savedNotes", "title subject semester")
      .populate("downloadedNotes", "title subject semester");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json(user);
  })
);

router.put(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    if (req.params.id !== req.user.userId && req.user.role !== "admin") {
      throw new ApiError(403, "Not authorized");
    }

    const allowedFields = ["firstName", "lastName", "bio", "course", "semester", "avatar"];
    const update = allowedFields.reduce((data, field) => {
      if (req.body[field] !== undefined) data[field] = req.body[field];
      return data;
    }, {});

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json({ message: "Profile updated", user });
  })
);

router.get(
  "/:id/stats",
  auth,
  asyncHandler(async (req, res) => {
    if (req.params.id !== req.user.userId && req.user.role !== "admin") {
      throw new ApiError(403, "Not authorized");
    }

    const user = await User.findById(req.params.id);

    const savedNoteCount = user?.savedNoteCount ?? user?.savedNotes?.length ?? 0;
    const downloadedNoteCount = user?.downloadedNoteCount ?? user?.downloadedNotes?.length ?? 0;

    res.json({
      notesUploaded: await Note.countDocuments({ uploadedBy: req.params.id }),
      downloadedNotes: downloadedNoteCount,
      notesSaved: savedNoteCount,
      downloadedNoteCount,
      savedNoteCount,
    });
  })
);

module.exports = router;
