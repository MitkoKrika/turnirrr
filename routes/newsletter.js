const express = require('express');
const router = express.Router();

router.post('/subscribe', async (req, res) => {
    console.log('New subscriber:', req.body.email);
    res.json({ message: 'Subscription successful' });
});

module.exports = router;