const express = require("express");
const Note = require("../models/Note");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const search = req.query.q || req.query.search || "";
    const limit = Math.min(Number(req.query.limit || 8), 25);

    if (!search) {
      return res.json({ notes: [] });
    }

    const text = { $regex: search, $options: "i" };

    const notes = await Note.find({
      status: "published",
      $or: [{ title: text }, { subject: text }, { description: text }, { tags: text }],
    })
      .populate("uploadedBy", "firstName lastName")
      .select("title subject description semester downloads likes uploadedBy")
      .limit(limit);

    return res.json({ notes });
  })
);

module.exports = router;
