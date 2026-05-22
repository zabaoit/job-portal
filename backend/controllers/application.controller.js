import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

const applyJob = async (req, res) => {
    try {
        const userId = req.id; // ID người dùng đã được middleware isAuthenticated gắn vào req
        const jobId = req.params.id; // ID công việc từ URL params

        if(!jobId){
            return res.status(400).json({
                message: "Job id is required",
                success: false
            });
        }

        // Kiểm tra xem người dùng đã nộp đơn cho công việc này chưa
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        // Nếu đã nộp đơn rồi thì trả về lỗi
        if(existingApplication){
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        
        const job = await Job.findById(jobId); // Tìm công việc theo ID
        if(!job){
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }
        // Tạo hồ sơ ứng tuyển mới
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.application.push(newApplication._id); // Thêm ID hồ sơ ứng tuyển vào mảng applications của công việc
        await job.save(); // Lưu công việc đã cập nhật
        return res.status(201).json({
            message: "Job applied successfully",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// Lấy tất cả hồ sơ ứng tuyển của người dùng đã đăng nhập
const getAplliedJobs = async (req, res) => {
    try {
        const userId = req.id; // ID người dùng đã được middleware isAuthenticated gắn vào req
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "company",
                options: { sort: { createdAt: -1 } },
            }
        }); // Tìm tất cả hồ sơ ứng tuyển của người dùng và điền thông tin công việc

        if(!application){
            return res.status(404).json({
                message: "No Applications",
                success: false
            });
        };

        return res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// admin lấy tất cả hồ sơ ứng tuyển của một công việc cụ thể
const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id; // ID công việc từ URL params
        const job = await Job.findById(jobId).populate({
            path: "application",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
            }
        })

        if(!job){
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// admin cập nhật trạng thái của hồ sơ ứng tuyển
const updateStatus = async (req, res) => {
    const { status } = req.body; // Trạng thái mới từ body
    const applicationId = req.params.id; // ID hồ sơ ứng tuyển từ URL params

    if(!status){
        return res.status(400).json({
            message: "Status is required",
            success: false
        });
    }

    const application = await Application.findOne({ _id: applicationId });
    if(!application){
        return res.status(404).json({
            message: "Application not found",
            success: false
        });
    }

    // Cập nhật trạng thái của hồ sơ ứng tuyển
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
        message: "Status updated successfully",
        success: true
    });
}

export { applyJob, getAplliedJobs, getApplicants, updateStatus };