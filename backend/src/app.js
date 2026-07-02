const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const musicRoutes = require('./routes/music.route');
const cors = require('cors')

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // 
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;