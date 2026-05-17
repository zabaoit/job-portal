import mongoose from "mongoose";

// Job application schema
const applicationSchema = new mongoose.Schema({
    // Reference to the job being applied for
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,    
    },

    // Reference to the user who applied
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Application workflow status
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    }
// timestamps adds createdAt and updatedAt automatically
}, { timestamps: true });

// Export Application model
export const Application = mongoose.model('Application', applicationSchema);
