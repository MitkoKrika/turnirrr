const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const auth = require('../midleware/auth');

router.get('/', auth, async (req, res) => {
    const tournaments = await Tournament.find();
    res.json(tournaments);
});

router.post('/', auth, async (req, res) => {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
});

router.delete('/:id', auth, async (req, res) => {
    await Tournament.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

router.get('upcoming', auth, async (req, res) => {
    try {
        const tournaments = await Tournament.findOne({ 
            date: { $gte: new Date() },
            status: 'active'
        }).sort({ date: 1 });

        if (!tournaments) {
            return res.status(404).json({ message: 'No upcoming tournaments found' });
        }
        res.json(tournaments);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/active', auth, async (req, res) => {
    try {
        const tournaments = await Tournament.find({ 
            status: 'active' 
        }).sort({ date: 1 });
        res.json(tournaments);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/admin/stats', async (req, res) => {
    try {
        const stats = {
            activeTournaments: await Tournament.countDocuments({ status: 'active' }),
            totalTeams: await Team.countDocuments(),
            pendingRegistrations: await Registration.countDocuments({ status: 'pending' }),
            newMessages: 0
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;