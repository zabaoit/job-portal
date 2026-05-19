import { Job } from "../models/job.model.js";
// admin có thể đăng công việc mới, có thể xem tất cả công việc, có thể tìm kiếm theo title hoặc description, có thể xem chi tiết công việc
const postJob = async (req, res) => {
    try {
        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId = req.id; // ID người dùng đã được middleware isAuthenticated gắn vào req

        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position, 
            company: companyId,
            create_by: userId,
        });

        return res.status(201).json({
            message: "New job created successfully",
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
// student có thể xem tất cả công việc, có thể tìm kiếm theo title hoặc description
const getAllJobs = async (req, res) => {
    try {
        // Tìm kiếm theo title hoặc description
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                { title: { $regex: keyword, $options: "i" } },
                {description: { $regex: keyword, $options: "i" } },
            ]
        }

        const jobs = await Job.find(query).populate({
            path: "company",
        }).sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất

        if(!jobs){
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Jobs retrieved successfully",
            jobs,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// student có thể xem chi tiết công việc
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id; // ID công việc từ URL params
        const job = await Job.findById(jobId); // Tìm công việc theo ID

        if(!job){
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            })
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
    
const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id; // ID admin đã được middleware isAuthenticated gắn vào req
        const jobs = await Job.find({ create_by: adminId }); // Tìm tất cả công việc do admin này tạo ra

        if(!jobs){
             return res.status(404).json({
                message: "Jobs not found",
                success: false
            })
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export { postJob, getAllJobs, getJobById, getAdminJobs };