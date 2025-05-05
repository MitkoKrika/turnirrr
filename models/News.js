const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    imageurl: {
        type: String,
        default: '/api/placeholder/400/250'
    },
    author: {
        type: String,
        default: 'Администратор'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', newsSchema);