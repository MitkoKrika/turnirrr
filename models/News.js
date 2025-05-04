const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
    imageurl: {
        type: String,
        required: true,
    },
});

const News = mongoose.model('News', newsSchema);