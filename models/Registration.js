const mongoose = require('mongoose');
const { create } = require('./User');

const registrationSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
    },
    captain: {
        type: String,
        required: true,
    },
    tournamentName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Registration', registrationSchema);