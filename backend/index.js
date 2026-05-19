import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors"
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js"

// Nạp biến môi trường từ file .env vào process.env
dotenv.config({});

// Khởi tạo instance ứng dụng Express
const app = express();

// Parse body dạng JSON
app.use(express.json());
// Parse body dạng URL-encoded (form submit truyền thống)
app.use(express.urlencoded({ extended: true }));
// Parse cookie từ header vào req.cookies
app.use(cookieParser());

// Cấu hình CORS cho frontend
const corsOptions = {
  origin: 'http://localhost:5173', // Đổi thành URL frontend thực tế của bạn
  credentials: true, // Cho phép gửi cookie/credentials qua CORS
};
app.use(cors(corsOptions));

// Ưu tiên PORT từ env, nếu không có thì dùng 3000
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user" , userRoute);
app.use("/api/v1/company" , companyRoute);

// Khởi chạy server HTTP và kết nối MongoDB
app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});
