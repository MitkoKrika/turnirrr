const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../midleware/auth');

router.get('/', auth, async (req, res) => {
    const teams = await Team.find();
    res.json(teams);
});

router.delete('/:id', auth, async (req, res) => {
    await Team.findByIdAndDelete(req.params.id);
    res.status(204).send();
});

module.exports = router;