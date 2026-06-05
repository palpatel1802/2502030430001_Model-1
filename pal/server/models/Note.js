const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  content: {
    type: String,
  },
  materialType: {
    type: String,
    enum: ["note", "video", "article", "assignment", "quiz", "reference"],
    default: "note",
  },
  course: {
    type: String,
    default: "B.Tech",
  },
  semester: {
    type: Number,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileUrl: {
    type: String,
    default: null,
  },
  fileName: {
    type: String,
    default: null,
  },
  fileType: {
    type: String,
    default: null,
  },
  fileSize: {
    type: Number,
    default: null,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  estimatedReadMinutes: {
    type: Number,
    default: 10,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tags: [String],
  visibility: {
    type: String,
    enum: ["public", "private", "course"],
    default: "public",
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "published",
  },
}, { timestamps: true });

noteSchema.index({ title: "text", subject: "text", description: "text", tags: "text" });
noteSchema.index({ course: 1, semester: 1, subject: 1 });

module.exports = mongoose.model("Note", noteSchema);
