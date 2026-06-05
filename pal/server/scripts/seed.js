const mongoose = require("mongoose");
const runDbSeederAndMigration = require("../config/seeder");
const env = require("../config/env");

const seed = async () => {
  try {
    mongoose.set("strictQuery", true);
    console.log(`Connecting to database: ${env.mongoUri}...`);
    await mongoose.connect(env.mongoUri);
    console.log("Connected successfully to MongoDB.");
    
    await runDbSeederAndMigration();
    
    console.log("Database seeding and migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding script failed:", error);
    process.exit(1);
  }
};

seed();
