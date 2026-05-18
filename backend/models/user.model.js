import mongoose from "mongoose";

// Schema tài khoản người dùng
const userSchema = new mongoose.Schema({
    // Họ tên đầy đủ của người dùng
    fullName: {
        type: String,
        required: true,
    },

    // Email đăng nhập (duy nhất)
    email: {
        type: String,
        required: true,
        unique: true,
    },  

    // Số điện thoại liên hệ
    phoneNumber : {
        type: String,
        required: true,
    },

    // Mật khẩu đã được hash
    password: {
        type: String,
        required: true, 
    },

    // Vai trò tài khoản
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true,
    },

    // Thông tin profile mở rộng
    profile: {
        // Giới thiệu ngắn
        bio: {type: String},
        // Danh sách kỹ năng
        skills: [{type: String}],
        // URL/đường dẫn file CV
        resume: {type: String},
        // Tên file CV gốc khi upload
        resumeOriginalName: {type: String},
        // Tham chiếu công ty của recruiter (nếu có)
        company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
        // URL/đường dẫn ảnh đại diện
        profilePhoto: {type: String,
            default: ""
        },
    }
// timestamps tự sinh createdAt và updatedAt
}, { timestamps: true });

// Export model User
export const User = mongoose.model('User', userSchema);
