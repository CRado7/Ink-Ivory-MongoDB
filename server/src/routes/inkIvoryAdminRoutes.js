
import express from "express";
import { registerAdmin, loginAdmin, getAdminProfile, getAllAdmins } from "../controllers/inkIvoryAdminController.js";
import { authMiddleware } from "../middleware/authMIddleware.js";

const router = express.Router();

router.post("/register", registerAdmin); // Register an admin
router.post("/login", loginAdmin); // Login an admin
router.get("/profile", authMiddleware, getAdminProfile); // Get logged-in admin profile
router.get("/all", authMiddleware, getAllAdmins); // Get all admins (Admin only)

export default router;
