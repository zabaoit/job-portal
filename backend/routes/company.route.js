import express from 'express'; 
import { registerCompany,
    getCompany,
    getCompanyById,
    updateCompany } from '../controllers/company.controller.js';
import isAuthenticated from '../middlewares/isAuthencicated.js';

const router = express.Router();

// Định nghĩa route cho company
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, updateCompany);

export default router;
