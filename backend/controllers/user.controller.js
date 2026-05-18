import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Hàm đăng ký tài khoản mới
const register = async (req, res) => {
    try{
        // Lấy dữ liệu người dùng gửi lên
        const {fullName, email,phoneNumber, password, role} = req.body;

        // Kiểm tra các trường bắt buộc
        if(!fullName || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        // Kiểm tra email đã tồn tại hay chưa
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            })
        }

        // Mã hóa mật khẩu trước khi lưu database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo document user mới
        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        });

        // Lưu user vào DB
        await newUser.save();

        // Trả response đăng ký thành công
        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });
    } catch (error) {
        // Lỗi hệ thống
        res.status(500).json({
            message: "Internal server error",
        })
    }
}

// Hàm đăng nhập
const login = async (req, res) => {
    try {
        // Lấy thông tin đăng nhập
        const { email, password, role } = req.body;

        // Validate dữ liệu đầu vào
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        // So sánh mật khẩu nhập vào với mật khẩu đã hash
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        // Kiểm tra role gửi lên có đúng với role tài khoản không
        if (user.role !== role) {
            return res.status(400).json({
                message: "Account does not exist with current role",
                success: false
            });
        }
        
        // Dữ liệu đưa vào JWT
        const tokenData = {
            userId: user._id,
        }

        // Tạo JWT token có hạn 1 ngày
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Tạo object user trả về cho client (không trả password)
        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
                profile: user.profile
        }

        // Gắn token vào cookie và trả kết quả đăng nhập thành công
        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 ngày
            httpOnly: true, // Không cho JS phía client đọc cookie
            sameSite: "strict", // Hạn chế CSRF cơ bản
        }).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success: true,
        });
    } catch (error) {
        // Lỗi hệ thống
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Hàm đăng xuất
const logout = async (req, res) => {
    try {
        // Xóa token bằng cookie rỗng + hết hạn ngay
        return res.status(200).cookie("token", "", {
            maxAge: 0,
        }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        // Lỗi hệ thống
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Hàm cập nhật hồ sơ người dùng
const updateProfile = async (req, res) => {
    try {
        // Lấy thông tin hồ sơ từ client
        const {fullName, email, phoneNumber, bio, skills} = req.body;

        // File upload (nếu middleware upload đã gắn)
        const file = req.file;

        // Validate dữ liệu bắt buộc
        if(!fullName || !email || !phoneNumber || !bio || !skills){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        // TODO: xử lý upload file lên cloudinary

        // Chuyển chuỗi skills thành mảng kỹ năng
        const shillsArray = skills.split(",");

        // req.id thường được middleware auth gắn sau khi verify token
        const userId = req.id;

        // Tìm user hiện tại trong DB
        let user = await User.findById(userId);

        // Không tìm thấy user
        if(!user){
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        // Cập nhật thông tin cơ bản và profile
        user.fullName = fullName;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.profile.bio = bio;
        user.profile.skills = shillsArray;

        // TODO: xử lý cập nhật resume ở bước sau

        // Lưu thay đổi vào DB
        await user.save();

        // Tạo object user trả về client (không gồm mật khẩu)
        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        // Trả response cập nhật thành công
        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        });
    } catch (error) {
        // Lỗi hệ thống
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
