const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const User = require("../models/User");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { upload } = require("../middleware/upload");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

const router = express.Router();
const objectIdRoute = ":id([0-9a-fA-F]{24})";

const buildQuery = (queryParams) => {
  const { search, semester, subject, course, tags, difficulty } = queryParams;
  const query = { status: "published" };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { fileName: { $regex: search, $options: "i" } },
    ];
  }

  if (semester) query.semester = Number(semester);
  if (subject) query.subject = { $regex: subject, $options: "i" };
  if (course) query.course = { $regex: course, $options: "i" };
  if (difficulty) query.difficulty = difficulty;
  if (tags) query.tags = { $in: String(tags).split(",").map((tag) => tag.trim()) };

  return query;
};

const populateUploader = { path: "uploadedBy", select: "firstName lastName email" };
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeUserNoteLists = async (userId) => {
  const user = await User.findById(userId).select("savedNotes downloadedNotes savedNoteCount downloadedNoteCount");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const savedNotes = [...new Set((user.savedNotes || []).map((id) => id.toString()).filter(isValidObjectId))];
  const downloadedNotes = [...new Set((user.downloadedNotes || []).map((id) => id.toString()).filter(isValidObjectId))];
  const referencedNoteIds = [...new Set([...savedNotes, ...downloadedNotes])];
  const existingNoteIds = referencedNoteIds.length
    ? new Set((await Note.find({ _id: { $in: referencedNoteIds } }).select("_id")).map((note) => note._id.toString()))
    : new Set();
  const existingSavedNotes = savedNotes.filter((id) => existingNoteIds.has(id));
  const existingDownloadedNotes = downloadedNotes.filter((id) => existingNoteIds.has(id));

  user.savedNotes = existingSavedNotes;
  user.downloadedNotes = existingDownloadedNotes;
  user.savedNoteCount = existingSavedNotes.length;
  user.downloadedNoteCount = existingDownloadedNotes.length;
  await user.save({ validateBeforeSave: false });

  return {
    savedNotes: user.savedNotes,
    downloadedNotes: user.downloadedNotes,
    savedNoteCount: user.savedNoteCount,
    downloadedNoteCount: user.downloadedNoteCount,
  };
};

const compactPopulatedNotes = (notes) => (notes || []).filter(Boolean);

const createNoteFromUpload = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "A document file is required");
  }

  const { title, subject, description, course, semester, tags, difficulty } = req.body;

  if (!title || !subject || !semester) {
    fs.unlink(req.file.path, () => {});
    throw new ApiError(400, "Title, subject, and semester are required");
  }

  const parsedTags = tags
    ? String(tags)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [subject, course || "B.Tech"].filter(Boolean);

  const fileUrl = `/uploads/${req.file.filename}`;

  const note = await Note.create({
    title,
    subject,
    description: description || "",
    course: course || "B.Tech",
    semester: Number(semester),
    tags: parsedTags,
    difficulty,
    fileUrl,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    uploadedBy: req.user.userId,
  });

  await note.populate(populateUploader);
  res.status(201).json({ message: "Note uploaded successfully", note });
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);
    const skip = (page - 1) * limit;
    const query = buildQuery(req.query);

    const [notes, total] = await Promise.all([
      Note.find(query).populate(populateUploader).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Note.countDocuments(query),
    ]);

    res.json({ data: notes, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  })
);

router.get(
  "/mine",
  auth,
  asyncHandler(async (req, res) => {
    const notes = await Note.find({ uploadedBy: req.user.userId })
      .populate(populateUploader)
      .sort({ createdAt: -1 });

    res.json({ data: notes });
  })
);

router.get(
  "/filters",
  asyncHandler(async (req, res) => {
    const baseQuery = { status: "published" };
    const [courses, subjects, semesters] = await Promise.all([
      Note.distinct("course", baseQuery),
      Note.distinct("subject", baseQuery),
      Note.distinct("semester", baseQuery),
    ]);

    res.json({
      courses: courses.filter(Boolean).sort(),
      subjects: subjects.filter(Boolean).sort(),
      semesters: semesters.filter(Boolean).sort((a, b) => a - b),
    });
  })
);

router.get(
  "/saved",
  auth,
  asyncHandler(async (req, res) => {
    await normalizeUserNoteLists(req.user.userId);
    const user = await User.findById(req.user.userId).populate({
      path: "savedNotes",
      populate: populateUploader,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const savedNotes = compactPopulatedNotes(user.savedNotes);
    res.json({ data: savedNotes, total: savedNotes.length });
  })
);

router.get(
  "/downloaded",
  auth,
  asyncHandler(async (req, res) => {
    await normalizeUserNoteLists(req.user.userId);
    const user = await User.findById(req.user.userId).populate({
      path: "downloadedNotes",
      populate: populateUploader,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const downloadedNotes = compactPopulatedNotes(user.downloadedNotes);
    res.json({ data: downloadedNotes, total: downloadedNotes.length });
  })
);

const uploadNoteHandler = [auth, upload.single("file"), asyncHandler(createNoteFromUpload)];

router.post("/upload", ...uploadNoteHandler);

router.get(
  `/${objectIdRoute}`,
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id).populate(populateUploader);

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    res.json(note);
  })
);

router.post(
  "/",
  auth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (req.file) {
      return createNoteFromUpload(req, res);
    }

    const {
      title,
      subject,
      description,
      content,
      course,
      semester,
      tags,
      fileUrl,
      fileName,
      fileType,
      fileSize,
      difficulty,
      estimatedReadMinutes,
    } = req.body;

    if (!title || !subject || semester === undefined || semester === "") {
      throw new ApiError(400, "Title, subject, and semester are required");
    }

    const note = await Note.create({
      title,
      subject,
      description,
      content,
      course,
      semester: Number(semester),
      tags,
      fileUrl,
      fileName,
      fileType,
      fileSize,
      difficulty,
      estimatedReadMinutes,
      uploadedBy: req.user.userId,
    });

    await note.populate(populateUploader);
    res.status(201).json({ message: "Note created successfully", note });
  })
);

router.put(
  `/${objectIdRoute}`,
  auth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
      if (req.file) fs.unlink(req.file.path, () => {});
      throw new ApiError(404, "Note not found");
    }

    if (note.uploadedBy.toString() !== req.user.userId && req.user.role !== "admin") {
      if (req.file) fs.unlink(req.file.path, () => {});
      throw new ApiError(403, "Not authorized");
    }

    const allowedFields = [
      "title",
      "subject",
      "description",
      "content",
      "course",
      "semester",
      "tags",
      "difficulty",
      "estimatedReadMinutes",
      "visibility",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "semester") {
          note[field] = Number(req.body[field]);
        } else if (field === "tags") {
          note[field] = String(req.body[field])
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        } else {
          note[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      if (note.fileUrl) {
        const previousPath = path.join(__dirname, "..", note.fileUrl.replace(/^\//, ""));
        if (fs.existsSync(previousPath)) {
          fs.unlink(previousPath, () => {});
        }
      }
      note.fileUrl = `/uploads/${req.file.filename}`;
      note.fileName = req.file.originalname;
      note.fileType = req.file.mimetype;
      note.fileSize = req.file.size;
    }

    await note.save();
    await note.populate(populateUploader);
    res.json({ message: "Note updated", note });
  })
);

router.delete(
  `/${objectIdRoute}`,
  auth,
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    if (note.uploadedBy.toString() !== req.user.userId && req.user.role !== "admin") {
      throw new ApiError(403, "Not authorized");
    }

    if (note.fileUrl) {
      const filePath = path.join(__dirname, "..", note.fileUrl.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    }

    await Note.findByIdAndDelete(req.params.id);

    const affectedUsers = await User.find({
      $or: [{ savedNotes: req.params.id }, { downloadedNotes: req.params.id }],
    }).select("_id");

    await User.updateMany(
      { $or: [{ savedNotes: req.params.id }, { downloadedNotes: req.params.id }] },
      { $pull: { savedNotes: req.params.id, downloadedNotes: req.params.id } }
    );

    await Promise.all(affectedUsers.map((user) => normalizeUserNoteLists(user._id)));

    res.json({ message: "Note deleted" });
  })
);

router.post(
  `/${objectIdRoute}/save`,
  auth,
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const noteId = note._id.toString();
    const alreadySaved = user.savedNotes && user.savedNotes.some((id) => id.toString() === noteId);

    if (!alreadySaved) {
      await User.findByIdAndUpdate(req.user.userId, { $addToSet: { savedNotes: note._id } });
    }

    const noteLists = await normalizeUserNoteLists(req.user.userId);

    await note.populate(populateUploader);
    res.json({ message: alreadySaved ? "Already saved" : "Note saved", note, noteLists });
  })
);

router.delete(
  `/${objectIdRoute}/save`,
  auth,
  asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user.userId, { $pull: { savedNotes: req.params.id } });
    const noteLists = await normalizeUserNoteLists(req.user.userId);
    res.json({ message: "Note removed from saved list", noteLists });
  })
);

router.post(
  `/${objectIdRoute}/download`,
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id).populate(populateUploader);

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    const token = req.header("Authorization")?.replace("Bearer ", "");
    let noteLists = null;
    let shouldIncrementDownloadTotal = true;

    if (token) {
      const authMiddleware = auth;
      await new Promise((resolve, reject) => {
        authMiddleware(req, res, (error) => (error ? reject(error) : resolve()));
      });

      const user = await User.findById(req.user.userId).select("downloadedNotes");
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      const alreadyDownloaded = user.downloadedNotes.some((id) => id.toString() === note._id.toString());
      shouldIncrementDownloadTotal = !alreadyDownloaded;

      if (!alreadyDownloaded) {
        user.downloadedNotes.push(note._id);
        await user.save({ validateBeforeSave: false });
      }

      noteLists = await normalizeUserNoteLists(req.user.userId);
    }

    if (shouldIncrementDownloadTotal) {
      note.downloads += 1;
      await note.save();
    }

    res.json({
      message: "Download recorded",
      note,
      noteLists,
      downloadedTotal: noteLists?.downloadedNotes?.length || 0,
    });
  })
);

router.post(
  `/${objectIdRoute}/like`,
  auth,
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
      throw new ApiError(404, "Note not found");
    }

    const alreadyLiked = note.likedBy.some((id) => id.toString() === req.user.userId);
    if (alreadyLiked) {
      note.likedBy = note.likedBy.filter((id) => id.toString() !== req.user.userId);
      note.likes = Math.max(note.likes - 1, 0);
    } else {
      note.likedBy.push(req.user.userId);
      note.likes += 1;
    }

    await note.save();
    res.json({ message: alreadyLiked ? "Like removed" : "Liked", note });
  })
);

module.exports = router;
