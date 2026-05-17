import mongoose from "mongoose";

// Connect to MongoDB using MONGO_URI from environment variables
const connectDB = async () => {
  try {
    // Attempt database connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    // Exit app if DB connection fails at startup
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Export reusable DB connection helper
export default connectDB;
