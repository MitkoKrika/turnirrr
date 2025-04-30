const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

// Свързване с MongoDB
mongoose.connect('mongodb://localhost:27017/cs-tournaments', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Модел за турнири
const tournamentSchema = new mongoose.Schema({
    name: String,
    date: Date,
    location: String,
    game: String,
    teams: Number,
    prize: Number,
    description: String,
    status: { type: String, default: 'active' }
});
const Tournament = mongoose.model('Tournament', tournamentSchema);

// Модел за отбори
const teamSchema = new mongoose.Schema({
    name: String,
    captain: String,
    players: [String],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});
const Team = mongoose.model('Team', teamSchema);

// Модел за регистрации
const registrationSchema = new mongoose.Schema({
    teamName: String,
    captain: String,
    tournamentName: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Registration = mongoose.model('Registration', registrationSchema);

// Модел за новини
const newsSchema = new mongoose.Schema({
    title: String,
    date: Date,
    content: String,
    image: String,
    author: String
});
const News = mongoose.model('News', newsSchema);

// Модел за потребители
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    status: { type: String, default: 'active' }
});
const User = mongoose.model('User', userSchema);

// Модел за програма
const scheduleSchema = new mongoose.Schema({
    tournamentName: String,
    title: String,
    date: Date,
    description: String
});
const Schedule = mongoose.model('Schedule', scheduleSchema);

// Модел за схема
const bracketSchema = new mongoose.Schema({
    tournamentName: String,
    matches: [{
        round: String,
        team1: { name: String, score: Number },
        team2: { name: String, score: Number },
        date: Date
    }]
});
const Bracket = mongoose.model('Bracket', bracketSchema);

// Middleware за проверка на токен
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// API за вход
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username, role: user.role }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
});

// API за статистики
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
    const activeTournaments = await Tournament.countDocuments({ status: 'active' });
    const registeredTeams = await Team.countDocuments();
    const newRegistrations = await Registration.countDocuments({ status: 'pending' });
    const newMessages = 0;
    res.json({ activeTournaments, registeredTeams, newRegistrations, newMessages });
});

// API за турнири
app.get('/api/admin/tournaments', authenticateToken, async (req, res) => {
    const tournaments = await Tournament.find();
    res.json(tournaments);
});

app.post('/api/admin/tournaments', authenticateToken, async (req, res) => {
    const tournament = new Tournament(req.body);
    await tournament.save();
    res.status(201).json(tournament);
});

app.put('/api/admin/tournaments/:id', authenticateToken, async (req, res) => {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tournament);
});

app.delete('/api/admin/tournaments/:id', authenticateToken, async (req, res) => {
    await Tournament.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// API за отбори
app.get('/api/admin/teams', authenticateToken, async (req, res) => {
    const teams = await Team.find();
    res.json(teams);
});

app.delete('/api/admin/teams/:id', authenticateToken, async (req, res) => {
    await Team.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// API за регистрации
app.get('/api/admin/registrations', authenticateToken, async (req, res) => {
    const registrations = await Registration.find();
    res.json(registrations);
});

app.put('/api/admin/registrations/:id/approve', authenticateToken, async (req, res) => {
    const registration = await Registration.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(registration);
});

app.put('/api/admin/registrations/:id/reject', authenticateToken, async (req, res) => {
    const registration = await Registration.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json(registration);
});

app.delete('/api/admin/registrations/:id', authenticateToken, async (req, res) => {
    await Registration.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// API за новини
app.get('/api/admin/news', authenticateToken, async (req, res) => {
    const news = await News.find();
    res.json(news);
});

app.post('/api/admin/news', authenticateToken, async (req, res) => {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
});

app.put('/api/admin/news/:id', authenticateToken, async (req, res) => {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(news);
});

app.delete('/api/admin/news/:id', authenticateToken, async (req, res) => {
    await News.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// API за потребители
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post('/api/admin/users', authenticateToken, async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json(user);
});

app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
    const updateData = { ...req.body };
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
        delete updateData.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(user);
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// Публичен API за програма
app.get('/api/tournament/schedule', async (req, res) => {
    const schedule = await Schedule.find({ tournamentName: 'CS 1.6 Турнир за Тиктокъри 2025' });
    res.json(schedule);
});

// Публичен API за схема
app.get('/api/tournament/bracket', async (req, res) => {
    const bracket = await Bracket.findOne({ tournamentName: 'CS 1.6 Турнир за Тиктокъри 2025' });
    res.json(bracket || { matches: [] });
});

// Статични файлове
app.use(express.static('public'));

app.listen(3000, () => console.log('Server running on port 3000'));

// Примерни данни за MongoDB
db.tournaments.insertOne({
    name: "CS 1.6 Турнир-п за Тиктокъри 2025",
    date: new Date("2025-05-03T14:00:00"),
    location: "Онлайн",
    game: "Counter-Strike 1.6",
    teams: 2,
    prize: 5000,
    description: "П ELEMENTървият официален турнир на CS Турнири ще събере топ тиктокъри гейминг стриймъри, които ще се изправят един срещу друг в легендарната игра Counter-Strike 1.6.",
    status: "active"
});

db.teams.insertOne({
    name: "Team Beta",
    captain: "Мария Петрова",
    players: ["Александър", "Стефан", "Виктор", "Елена"],
    status: "approved"
});

db.registrations.insertOne({
    teamName: "Team Alpha",
    captain: "Иван Иванов",
    tournamentName: "CS 1.6 Турнир за Тиктокъри 2025",
    status: "approved",
    createdAt: new Date()
});

db.registrations.insertOne({
    teamName: "Team Beta",
    captain: "Мария Петрова",
    tournamentName: "CS 1.6 Турнир за Тиктокъри 2025",
    status: "approved",
    createdAt: new Date()
});

db.news.insertOne({
    title: "Нов CS 1.6 турнир обявен!",
    date: new Date(),
    content: "Подгответе се за CS 1.6 Турнир за Тиктокъри 2025!",
    image: "https://example.com/image.jpg",
    author: "Администратор"
});

db.schedule.insertMany([
    {
        tournamentName: "CS 1.6 Турнир за Тиктокъри 2025",
        title: "Откриване",
        date: new Date("2025-05-03T14:00:00"),
        description: "Официално откриване на турнира с представяне на отборите."
    },
    {
        tournamentName: "CS 1.6 Турнир за Тиктокъри 2025",
        title: "Финал",
        date: new Date("2025-05-03T16:00:00"),
        description: "Финален мач между двата отбора за първото място."
    }
]);

db.brackets.insertOne({
    tournamentName: "CS 1.6 Турнир за Тиктокъри 2025",
    matches: [
        {
            round: "Финал",
            team1: { name: "Team Alpha", score: 16 },
            team2: { name: "Team Beta", score: 13 },
            date: new Date("2025-05-03T16:00:00")
        }
    ]
});