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
        default: 'None',
        required: true,
    },
    teamId: {
        type: String,
        default: '0',
        required: true,
    },
    teamName: {
        type: String,
        default: 'None',
        required: true,
    },
    teamRole: {
        type: String,
        default: 'None', // values: leader, member
        required: true,
    },
    teamUsers: {
        type: Array,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'active',
    },
    avatar: {
        type: String,
        default: '/img/default-avatar.png',
    },
});

module.exports = mongoose.model('User', userSchema);