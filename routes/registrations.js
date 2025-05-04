const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const auth = require('../midleware/auth');

router.get('/', auth, async (req, res) => {
    const registrations = await Registration.find();
    res.json(registrations);
});

router.put('/:id/approve', auth, async (req, res) => {
    const reg = await Registration.findByIdAndUpdate(
        req.params.id,
        { status: 'approved' },
        { new: true }
    );
    res.json(reg);
});

router.put('/:id/reject', auth, async (req, res) => {
    const reg = await Registration.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected' },
        { new: true }
    );
    res.json(reg);
});

module.exports = router;