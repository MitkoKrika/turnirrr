// api.js - JSON API endpoints
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// База данни (може да се замени с реална база данни)
let db = {
  tournaments: [
    {
      id: 1,
      name: "TikTok CS 1.6 Турнир - BG",
      date: "2025-05-03T14:00:00",
      location: "Онлайн",
      game: "Counter-Strike 1.6",
      teams: 2,
      prizePool: 7500,
      status: "upcoming"
    }
  ],
  teams: [],
  registrations: []
};

// Middleware за CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// GET endpoints
app.get('/api/tournaments', (req, res) => {
  res.json(db.tournaments);
});

app.get('/api/tournaments/:id', (req, res) => {
  const tournament = db.tournaments.find(t => t.id === parseInt(req.params.id));
  if (tournament) {
    res.json(tournament);
  } else {
    res.status(404).json({ error: 'Турнирът не е намерен' });
  }
});

app.get('/api/teams', (req, res) => {
  res.json(db.teams);
});

// POST endpoints
app.post('/api/teams', (req, res) => {
  const newTeam = {
    id: db.teams.length + 1,
    ...req.body,
    registeredAt: new Date().toISOString()
  };
  db.teams.push(newTeam);
  res.status(201).json(newTeam);
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Липсват задължителни полета' });
  }
  res.json({ message: 'Съобщението е изпратено успешно!' });
});

// Стартиране на сървъра
app.listen(PORT, () => {
  console.log(`API сървърът работи на http://localhost:${PORT}`);
});
