import InkIvoryAdmin from "../models/InkIvoryAdmin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Ink & Ivory Admin
export const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingAdmin = await InkIvoryAdmin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new InkIvoryAdmin({ username, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login Ink & Ivory Admin
export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await InkIvoryAdmin.findOne({ username });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token, admin: { id: admin._id, username: admin.username, role: admin.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Admin Profile (Protected)
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await InkIvoryAdmin.findById(req.user.id).select("-password");
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Admins (Protected, Admin Only)
export const getAllAdmins = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        const admins = await InkIvoryAdmin.find().select("-password");
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
