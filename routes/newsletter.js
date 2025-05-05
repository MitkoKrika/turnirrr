const express = require('express');
const router = express.Router();

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Имейл адресът е задължителен' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Моля, въведете валиден имейл адрес' });
        }

        console.log('Нов абонат:', email);
        
        res.json({ 
            success: true,
            message: 'Успешно се абонирахте за нашия бюлетин!'
        });
    } catch (error) {
        console.error('Грешка при абониране:', error);
        res.status(500).json({ 
            success: false,
            message: 'Възникна грешка при абонирането. Моля, опитайте отново.'
        });
    }
});

module.exports = router;