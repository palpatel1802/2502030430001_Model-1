const mongoose = require("mongoose");
const connectDatabase = require("../config/database");

const run = async () => {
  await connectDatabase();
  const users = mongoose.connection.db.collection("users");

  const result = await users.updateMany(
    {},
    [
      {
        $set: {
          savedNotes: { $ifNull: ["$savedNotes", []] },
          downloadedNotes: { $ifNull: ["$downloadedNotes", []] },
        },
      },
      {
        $set: {
          savedNoteCount: { $size: "$savedNotes" },
          downloadedNoteCount: { $size: "$downloadedNotes" },
        },
      },
      {
        $unset: ["enrolledCourses", "savedMaterials", "performance"],
      },
    ]
  );

  console.log(`Users cleaned: matched ${result.matchedCount}, modified ${result.modifiedCount}`);
};

run()
  .catch((error) => {
    console.error("User notes cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
