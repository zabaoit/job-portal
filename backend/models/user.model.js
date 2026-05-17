import mongoose from "mongoose";

// User account schema
const userSchema = new mongoose.Schema({
    // Full name of the account owner
    fullName: {
        type: String,
        required: true,
    },

    // Login email (must be unique)
    email: {
        type: String,
        required: true,
        unique: true,
    },  

    // Contact phone number
    phoneNumber : {
        type: String,
        required: true,
    },

    // Hashed password
    password: {
        type: String,
        required: true, 
    },

    // Role-based account type
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true,
    },

    // Nested profile metadata
    profile: {
        // Short self-introduction
        bio: {type: String},
        // Skills list
        skills: [{type: String}],
        // Resume file URL/path
        resume: {type: String},
        // Original uploaded resume filename
        resumeOriginalName: {type: String},
        // Recruiter company reference (if any)
        company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
        // Profile image URL/path
        profilePhoto: {type: String,
            default: ""
        },
    }
// timestamps adds createdAt and updatedAt automatically
}, { timestamps: true });

// Export User model
export const User = mongoose.model('User', userSchema);
