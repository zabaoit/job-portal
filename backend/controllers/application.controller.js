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
            return req.status(400).json({
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
            application: newApplication,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export { applyJob };