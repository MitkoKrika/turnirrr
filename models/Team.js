const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    captain: {
        type: String,
        required: true,
    },
    players: [String],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
});

module.exports = mongoose.model('Team', teamSchema);