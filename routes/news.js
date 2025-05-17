const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Helper function for error handling
const handleError = (res, error, defaultMessage) => {
    console.error(error);
    res.status(500).json({ 
        success: false,
        message: error.message || defaultMessage
    });
};

// Create news
router.post('/', async (req, res) => {
    try {
        const { title, content, imageurl, author } = req.body;
        
        // Validation
        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: 'Title and content are required' 
            });
        }

        const newNews = new News({
            title,
            content,
            imageurl: imageurl || '/api/placeholder/400/250',
            author: author || 'Admin'
        });

        const savedNews = await newNews.save();
        
        res.status(201).json({
            success: true,
            data: savedNews
        });

    } catch (error) {
        handleError(res, error, 'Failed to create news');
    }
});

// Get latest news
router.get('/latest', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const news = await News.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('-__v'); // Exclude version key
            
        res.json({
            success: true,
            count: news.length,
            data: news
        });
    } catch (error) {
        handleError(res, error, 'Failed to fetch news');
    }
});

// Latest news route for index page
router.get('/api/news/latest', async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 }).limit(3);
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all news (admin)
router.get('/admin', async (req, res) => {
    try {
        const news = await News.find()
            .sort({ createdAt: -1 })
            .select('-__v');
            
        res.json({
            success: true,
            count: news.length,
            data: news
        });
    } catch (error) {
        handleError(res, error, 'Failed to fetch news');
    }
});
// Get news by ID
router.get('/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id).select('-__v');
        
        if (!news) {
            return res.status(404).json({ 
                success: false,
                message: 'News not found' 
            });
        }

        res.json({
            success: true,
            data: news
        });
    } catch (error) {
        handleError(res, error, 'Failed to fetch news');
    }
});

// Update news
router.put('/:id', async (req, res) => {
    try {
        const { title, content, imageurl } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({ 
                success: false,
                message: 'Title and content are required' 
            });
        }

        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                imageurl: imageurl || '/api/placeholder/400/250'
            },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!updatedNews) {
            return res.status(404).json({ 
                success: false,
                message: 'News not found' 
            });
        }

        res.json({
            success: true,
            data: updatedNews
        });
    } catch (error) {
        handleError(res, error, 'Failed to update news');
    }
});

// Delete news
router.delete('/:id', async (req, res) => {
    try {
        const deletedNews = await News.findByIdAndDelete(req.params.id);
        
        if (!deletedNews) {
            return res.status(404).json({ 
                success: false,
                message: 'News not found' 
            });
        }

        res.json({
            success: true,
            message: 'News deleted successfully'
        });
    } catch (error) {
        handleError(res, error, 'Failed to delete news');
    }
});

module.exports = router;