import mongoose from "mongoose";

// Schema bài đăng tuyển dụng
const jobSchema = new mongoose.Schema({
    // Tiêu đề công việc hiển thị cho ứng viên
    title: {
        type: String,
        required: true,
    },

    // Mô tả chi tiết công việc
    description: {
        type: String,
        required: true,
    },      

    // Danh sách yêu cầu/kỹ năng (dạng chuỗi)
    requirements:[{
        type: String,
    }],

    // Mức lương (lưu dạng text)
    salary: {
        type: Number,
        required: true,
    },

    experienceLevel: {
        type: Number,
        required: true,
    },
    // Địa điểm làm việc
    location: {
        type: String,
        required: true,
    },

    // Loại hình công việc (full-time, part-time, ...)
    jobType: {
        type: String,
       required: true,
    },

    // Số lượng vị trí đang tuyển
    position: {
        type: Number,
        required: true,
    },

    // Công ty sở hữu bài đăng này
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },

    // User (recruiter) tạo bài đăng
    create_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Danh sách ID hồ sơ ứng tuyển liên quan
    application: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }],
// timestamps tự sinh createdAt và updatedAt
}, { timestamps: true });

// Export model Job
export const Job = mongoose.model('Job', jobSchema);    
