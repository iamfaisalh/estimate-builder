import mongoose from "mongoose";
import bluebird from "bluebird";
import { MONGO_URI } from "./config";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.Promise = bluebird;
    await mongoose.connect(MONGO_URI, {
      connectTimeoutMS: 50000,
    });
    console.log("MongoDB is connected");
  } catch (error) {
    if (error instanceof mongoose.MongooseError) console.error(error.message);
    else console.log("MongoDB connection failed");
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("\nMongoDB connection closed");
    process.exit(0);
  } catch (error) {
    if (error instanceof mongoose.MongooseError) console.error(error.message);
    else console.log("\nMongoDB connection failed to close");
    process.exit(1);
  }
};

// Capture app termination/restart events
// For nodemon restarts
process.once("SIGUSR2", async () => {
  await closeDB();
  process.kill(process.pid, "SIGUSR2");
});

// For app termination
process.on("SIGINT", closeDB);

// For Heroku app termination
process.on("SIGTERM", closeDB);
