// middleware/checkUserAuth.js
const jwt = require('jsonwebtoken');
const userModel = require("../models/user");

const checkUserAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized! Please login as user."
        });
    }

    try {
        const SECRET = process.env.JWT_SECRET || 'pn1234';
        const decoded = jwt.verify(token, SECRET);

        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(403).json({ success: false, message: "Access denied: Users only" });
        }

        req.udata = { ...user._doc, role: "user" };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = checkUserAuth;
