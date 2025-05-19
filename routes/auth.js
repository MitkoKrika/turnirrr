const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../midleware/authMiddleware');
const multer = require('multer');
const path = require('path');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        console.log('❌ Потребителят не е намерен:', username);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // DEBUG: Логваме паролите за сравнение
    console.log('🟡 Въведена парола:', password);
    console.log('🟡 Хеширана парола от базата:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        console.log('❌ Паролата не съвпада!');
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Паролата съвпада. Продължаваме с издаване на token');

    const token = jwt.sign(
        { username, role: user.role },
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/me', verifyToken, async (req, res) => {
  try {
    console.log('📦 Данни от клиента:', req.body);

    const updateFields = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { username: req.user.username },
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Успешно обновен потребител:', updatedUser);
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error('❌ Грешка при обновяване на потребител:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.user.username;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: 'Потребителят не е намерен.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Невалидна текуща парола.' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ success: true, message: 'Паролата е сменена успешно.' });
  } catch (err) {
    console.error('Грешка при смяна на парола:', err);
    res.status(500).json({ success: false, message: 'Сървърна грешка.' });
  }
});

// Конфигурация на Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.username}_avatar${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Позволени са само PNG или JPEG файлове'));
    }
    cb(null, true);
  }
});

router.post(
  '/upload-avatar',
  verifyToken,                      // 🔹 Първо декодираме токена
  upload.single('avatar'),         // 🔹 След това приемаме файла
  async (req, res) => {
    console.log('📥 Получен файл:', req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Файлът липсва' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;

    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      { avatar: avatarPath },
      { new: true }
    );

    res.json({ success: true, avatar: avatarPath });
  }
);

router.use((req, res, next) => {
  console.log('📩 POST заявка достигна до routes/auth.js:', req.method, req.originalUrl);
  next();
});

router.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

module.exports = router;