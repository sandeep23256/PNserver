const jwt = require('jsonwebtoken');
const adminModel = require("../models/admin");

const checkAdminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        // console.log("TOKEN FROM COOKIE:", token);

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized! Please login." });
        }

        const SECRET = process.env.JWT_SECRET || 'pn1234';
        const decoded = jwt.verify(token, SECRET); // <-- पहले define करो फिर use करो
        // console.log("DECODED TOKEN:", decoded);

        const admin = await adminModel.findById(decoded.id).select("-password");
        // console.log("ADMIN FOUND:", admin);

        if (!admin) {
            return res.status(403).json({ success: false, message: "Access denied: Admin only" });
        }

        req.udata = { ...admin._doc, role: "admin" };
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = checkAdminAuth;
