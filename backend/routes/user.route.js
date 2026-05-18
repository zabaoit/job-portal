import express from 'express';
import { register, login, logout, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthencicated.js';

const router = express.Router();

// Định nghĩa route cho user
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;
