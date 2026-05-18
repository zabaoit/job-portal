import mongoose from "mongoose";

// Schema lưu hồ sơ ứng tuyển
const applicationSchema = new mongoose.Schema({
    // Tham chiếu đến job mà ứng viên ứng tuyển
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,    
    },

    // Tham chiếu đến user nộp đơn
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Trạng thái xử lý hồ sơ
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    }
// timestamps tự sinh createdAt và updatedAt
}, { timestamps: true });

// Export model Application
export const Application = mongoose.model('Application', applicationSchema);
