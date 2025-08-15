const mongoose = require('mongoose');
require('dotenv').config(); // सबसे ऊपर dotenv को लोड करें

const connectDB = async () => {
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('✅ Connected to the database');
        })
        .catch((error) => {
            console.error('❌ Database connection error:', error);
        });
};

module.exports = connectDB;
