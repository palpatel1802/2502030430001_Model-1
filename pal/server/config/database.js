const mongoose = require("mongoose");
const env = require("./env");
const runDbSeederAndMigration = require("./seeder");

const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);

  // Run database migration and automated seeding
  await runDbSeederAndMigration();
};

module.exports = connectDatabase;
