import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new account
const register = async (req, res) => {
    try{
        // Read required fields from request body
        const {fullName, email,phoneNumber, password, role} = req.body;

        // Basic required-field validation
        if(!fullName || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        // Check if email is already registered
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            })
        }

        // Hash password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user document
        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        });

        // Persist user in MongoDB
        await newUser.save();

        // Return success response
        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });
    } catch (error) {
        // Generic server error fallback
        res.status(500).json({
            message: "Internal server error",
        })
    }
}

// Login with email/password/role
const login = async (req, res) => {
    try {
        // Read credentials from request body
        const { email, password, role } = req.body;

        // Basic required-field validation
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Find account by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        // Compare plain password with hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        // Ensure role from request matches stored account role
        if (user.role !== role) {
            return res.status(400).json({
                message: "Account does not exist with current role",
                success: false
            });
        }
        
        // JWT payload data
        const tokenData = {
            userId: user._id,
        }

        // Create JWT token valid for 1 day
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Build safe user object for response (exclude password)
        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
                profile: user.profile
        }

        // Set auth cookie and send success response
        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        }).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success: true,
        });
    } catch (error) {
        // Generic server error fallback
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Logout by clearing auth cookie
const logout = async (req, res) => {
    try {
        // Clear token cookie immediately
        return res.status(200).cookie("token", "", {
            maxAge: 0,
        }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        // Generic server error fallback
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
