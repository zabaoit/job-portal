import express from 'express'; 
import isAuthenticated from '../middlewares/isAuthencicated.js';
import { applyJob, getAplliedJobs, getApplicants, updateStatus } from '../controllers/application.controller.js';

const router = express.Router();

// Định nghĩa route cho application
router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAplliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;
