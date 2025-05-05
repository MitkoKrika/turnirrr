const express = require('express');
const router = express.Router();
const News = require('../models/News');

router.post('/', async (req, res) => {
    try {
        const newNews = new News(req.body);
        await newNews.save();
        res.status(201).json(newNews);
    } catch (error) {
        console.error('Грешка при създаване на новина:', error);
        res.status(500).json({ message: 'Грешка при запазване на новината' });
    }
});

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