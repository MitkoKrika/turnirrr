require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
//MongoDB connection
// Connect to the database
connectDB();
// routes
app.use('/api/login', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/admin/tournaments', require('./routes/tournaments'));
app.use('/api/admin/teams', require('./routes/teams'));
app.use('/api/admin/registrations', require('./routes/registrations'));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});