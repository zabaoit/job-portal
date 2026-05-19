import { Company } from "../models/company.model.js";

const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if(!companyName){
            return res.status(400).json({
                message: "Company name is required",
                success: false
            })
        }

        let company = await Company.findOne({ name: companyName });
        if(company){
            return res.status(400).json({
                message: "You can't register same company",
                success: false
            })
        }

        company = await Company.create({
            name: companyName,
            userId: req.id
        });
       
        res.status(201).json({
            message: "Company registered successfully",
            company,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const getCompany = async (req, res) => {
    try {
        const userId = req.id; // ID người dùng đã được middleware auth gắn vào req sau khi verify token
        const companies = await Company.find({ userId }); // Tìm tất cả công ty do user này tạo

        if(!companies){
            return res.status(404).json({
                message: "Companies not found",
                success: false
            })
        }
        res.status(200).json({
            message: "Companies retrieved successfully",
            companies,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id; // ID công ty từ URL params
        const company = await Company.findById(companyId); // Tìm công ty theo ID

        if(!company){
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }

        res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
    
}
    
const updateCompany = async (req, res) => {
    try {
        const {name, description, website, location} = req.body;
        const file = req.file; // file ảnh logo mới (nếu có)

        const updateData = {name, description, website, location};

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' }); // Cập nhật công ty và trả về bản mới
        
        if(!company){
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }

        res.status(200).json({
            message: "Company infomation updated",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export {
    registerCompany,
    getCompany,
    getCompanyById,
    updateCompany
}

