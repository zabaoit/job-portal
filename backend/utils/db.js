import mongoose from "mongoose";

// Kết nối MongoDB bằng MONGO_URI trong biến môi trường
const connectDB = async () => {
  try {
    // Thực hiện kết nối tới database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    // Thoát app nếu kết nối DB thất bại khi khởi động
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Export hàm kết nối để tái sử dụng
export default connectDB;
