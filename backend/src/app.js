const express = require('express');
const authRoutes = require('./routes/auth.route');
const musicRoutes = require('./routes/music.route');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
// Simple request logger for debugging auth requests
app.use((req, res, next) => {
    console.log(`[req] ${req.method} ${req.originalUrl}`);
    next();
});
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);

module.exports = app;