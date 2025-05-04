const express = require('express');
const router = express.Router();
const News = require('../models/News');

router.get('latest', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const news = await News.find()
        .sort({ date: -1 })
        .limit(limit);
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/admin/news', async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;