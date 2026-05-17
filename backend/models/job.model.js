import mongoose from "mongoose";

// Job posting schema
const jobSchema = new mongoose.Schema({
    // Job title shown to candidates
    title: {
        type: String,
        required: true,
    },

    // Full job description
    description: {
        type: String,
        required: true,
    },      

    // List of skill/requirement strings
    requirements:[{
        type: String,
    }],

    // Salary text (range/amount)
    salary: {
        type: String,
        required: true,
    },

    // Job location
    location: {
        type: String,
        required: true,
    },

    // Employment type (full-time, part-time, etc.)
    jobType: {
        type: String,
       required: true,
    },

    // Number of open positions
    position: {
        type: Number,
        required: true,
    },

    // Company that owns this job post
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },

    // User (recruiter) who created the post
    create_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // List of related application IDs
    application: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }],
// timestamps adds createdAt and updatedAt automatically
}, { timestamps: true });

// Export Job model
export const Job = mongoose.model('Job', jobSchema);    
