const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    discord: {
        type: String,
        required: true,
    },
    team: {
        type: String,
        required: true,
    },
    teamId: {
        type: String,
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    teamRole: {
        type: String,
        required: true,
    },
    teamUsers: {
        type: Array,
        required: true,
    },
    role: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        default: 'active',
    },
});

module.exports = mongoose.model('User', userSchema);