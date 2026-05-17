import mongoose from "mongoose";

// Company collection schema
const companySchema = new mongoose.Schema({
    // Company display name
    name: {
        type: String,
        required: true,
    },

    // Brief company description/about text
    description: {
        type: String,
    },

    // Company website URL
    website: {
        type: String,
    },

    // Company location text
    location: {
        type: String,
    },

    // URL to company logo image
    logo : {
        type: String, // url to company logo
    },

    // Owner/recruiter who created this company profile
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
// timestamps adds createdAt and updatedAt automatically
}, { timestamps: true });

// Export Company model
export const Company = mongoose.model('Company', companySchema);
