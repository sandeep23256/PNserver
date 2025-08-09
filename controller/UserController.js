const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const userModel = require('../models/user');

require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class UserController {
    // Register
    static register = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existing = await userModel.findOne({ email });
            if (existing) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userModel.create({ name, email, password: hashedPassword });

            // Generate token
            const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
                expiresIn: '4d'
            });

            // Set token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    // Login
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            // Generate token
            const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
                expiresIn: '4d'
            });

            // Set token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };


   static home = async (req, res) => {
        res.status(200).json({ message: 'Welcome to  Home ✅' });
    };

    // Profile (single admin from token)
    static profile = async (req, res) => {
        try {
            // req.udata middleware से आता है
            return res.status(200).json({
                success: true,
                message: "User profile fetched successfully",
                data: req.udata,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
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
}

module.exports = UserController;
