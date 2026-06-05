const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
  course: {
    type: String,
    default: "B.Tech",
  },
  semester: {
    type: Number,
    default: 1,
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: "",
  },
  savedNotes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    default: [],
  },
  savedNoteCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  downloadedNotes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    default: [],
  },
  downloadedNoteCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

const uniqueObjectIds = (ids = []) => {
  const seen = new Set();
  return ids.filter((id) => {
    const value = id?.toString();
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

userSchema.pre("save", function (next) {
  this.savedNotes = uniqueObjectIds(this.savedNotes);
  this.downloadedNotes = uniqueObjectIds(this.downloadedNotes);
  this.savedNoteCount = this.savedNotes.length;
  this.downloadedNoteCount = this.downloadedNotes.length;
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
