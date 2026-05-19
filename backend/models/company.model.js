import mongoose from "mongoose";

// Schema lưu thông tin công ty
const companySchema = new mongoose.Schema({
    // Tên hiển thị của công ty
    name: {
        type: String,
        required: true,
        unique: true, // Không cho phép trùng tên công ty
    },

    // Mô tả ngắn về công ty
    description: {
        type: String,
    },

    // URL website công ty
    website: {
        type: String,
    },

    // Địa điểm/vị trí công ty
    location: {
        type: String,
    },

    // URL ảnh logo công ty
    logo : {
        type: String, // đường dẫn logo công ty
    },

    // Người dùng (recruiter) tạo hồ sơ công ty này
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
// timestamps tự sinh createdAt và updatedAt
}, { timestamps: true });

// Export model Company
export const Company = mongoose.model('Company', companySchema);
