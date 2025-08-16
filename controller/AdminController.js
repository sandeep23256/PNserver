const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const adminModel = require('../models/admin');

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class AdminController {
    // Admin Registration
    static register = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    status: "failed",
                    message: "All fields are required!"
                });
            }

            const existingUser = await adminModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const Admin = await adminModel.create({
                name,
                email,
                password: hashedPassword
            });

            return res.status(201).json({
                status: "success",
                message: "Admin registered successfully",
                data: Admin
            });

        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({
                status: "failed",
                message: "Internal server error"
            });
        }
    };

    // Admin Login
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: "failed",
                    message: "Email and password are required"
                });
            }

            const admin = await adminModel.findOne({ email });
            if (!admin) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid email or password"
                });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: "failed",
                    message: "Invalid email or password"
                });
            }

            // ✅ Generate JWT token
            const SECRET = process.env.JWT_SECRET || 'pn1234';
            const token = jwt.sign(
                { id: admin._id, role: 'admin' },
                SECRET,
                { expiresIn: '1d' }
            );

            // ✅ Set token in HTTP-only cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,             // HTTPS ke liye must
                sameSite: 'None',         // cross-site cookie allow
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                status: "success",
                message: "Login successful",
                data: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            });

        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({
                status: "failed",
                message: "Internal server error"
            });
        }
    };

    // Change Password
    static changePassword = async (req, res) => {
        try {
            const { id } = req.params;
            const { oP, nP } = req.body;

            if (!oP || !nP) {
                return res.status(400).json({ success: false, message: "Old and new passwords are required" });
            }

            const admin = await adminModel.findById(id);
            if (!admin) {
                return res.status(404).json({ success: false, message: "Admin not found" });
            }

            const isMatch = await bcrypt.compare(oP, admin.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Old password is incorrect" });
            }

            const hashedPassword = await bcrypt.hash(nP, 10);
            admin.password = hashedPassword;
            await admin.save();

            return res.status(200).json({ success: true, message: "Password changed successfully" });
        } catch (error) {
            console.error("Change password error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    // Logout
    static logOut = async (req, res) => {
        try {
            res.clearCookie("token");
            return res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };

    // Admin Dashboard
    static dashboard = async (req, res) => {
        res.status(200).json({ message: 'Welcome to Admin Dashboard ✅' });
    };

    // Profile (single admin from token)
    static profile = async (req, res) => {
        try {
            // req.udata middleware से आता है
            return res.status(200).json({
                success: true,
                message: "Admin profile fetched successfully",
                data: req.udata,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };
}

module.exports = AdminController;
