const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    game: {
        type: String,
        required: true,
    },
    prize: {
        type: Number,
        required: true,
    },
    teams: [
        {
            type: Number,
            required: true,
        },
    ],
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'active',
    },
});

module.exports = mongoose.model('Tournament', tournamentSchema);