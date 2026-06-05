const mongoose = require("mongoose");
const User = require("../models/User");
const Note = require("../models/Note");
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const runDbSeederAndMigration = async () => {
  try {
    console.log("Cleaning up unused collections from MongoDB...");
    const db = mongoose.connection.db;

    // Collections to drop
    const collectionsToDrop = ["courses", "progresses", "studymaterials"];
    const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);

    for (const coll of collectionsToDrop) {
      if (existingCollections.includes(coll)) {
        await db.dropCollection(coll);
        console.log(`Dropped collection: ${coll}`);
      }
    }

    // Migration for User schema consistency
    console.log("Running database migrations for user schema consistency...");

    // Remove obsolete fields from all users
    await User.updateMany(
      {},
      {
        $unset: {
          enrolledCourses: 1,
          savedMaterials: 1,
          performance: 1,
        },
      }
    );

    // Explicitly set savedNotes to [] for users that don't have it
    const fixResult = await User.updateMany(
      { savedNotes: { $exists: false } },
      { $set: { savedNotes: [] } }
    );

    await User.updateMany(
      { downloadedNotes: { $exists: false } },
      { $set: { downloadedNotes: [] } }
    );

    const users = await User.find({}).select("savedNotes downloadedNotes savedNoteCount downloadedNoteCount");
    let listFixes = 0;

    for (const user of users) {
      const savedNotes = [...new Set((user.savedNotes || []).map((id) => id.toString()).filter(isValidObjectId))];
      const downloadedNotes = [...new Set((user.downloadedNotes || []).map((id) => id.toString()).filter(isValidObjectId))];
      const referencedNoteIds = [...new Set([...savedNotes, ...downloadedNotes])];
      const existingNoteIds = referencedNoteIds.length
        ? new Set((await Note.find({ _id: { $in: referencedNoteIds } }).select("_id")).map((note) => note._id.toString()))
        : new Set();
      const existingSavedNotes = savedNotes.filter((id) => existingNoteIds.has(id));
      const existingDownloadedNotes = downloadedNotes.filter((id) => existingNoteIds.has(id));
      const savedNoteCount = existingSavedNotes.length;
      const downloadedNoteCount = existingDownloadedNotes.length;

      if (
        user.savedNoteCount !== savedNoteCount ||
        user.downloadedNoteCount !== downloadedNoteCount ||
        existingSavedNotes.length !== (user.savedNotes || []).length ||
        existingDownloadedNotes.length !== (user.downloadedNotes || []).length
      ) {
        user.savedNotes = existingSavedNotes;
        user.downloadedNotes = existingDownloadedNotes;
        user.savedNoteCount = savedNoteCount;
        user.downloadedNoteCount = downloadedNoteCount;
        await user.save({ validateBeforeSave: false });
        listFixes += 1;
      }
    }

    console.log(`User schema cleanup migration complete. Modified users (Missing savedNotes initialized: ${fixResult.modifiedCount}, note lists synchronized: ${listFixes}).`);
  } catch (error) {
    console.error("Database migration & cleanup failed:", error);
  }
};

module.exports = runDbSeederAndMigration;
