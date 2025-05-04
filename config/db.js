// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in .env file!");
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected!');
    } catch (error) {
        console.error('Connection error:', error.message)
        process.exit(1);
    }
};

module.exports = connectDB;