const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const musicRoutes = require("./routes/music.route");
const userRoutes = require("./routes/user.route");

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://spotify-clone-phi-kohl.vercel.app",
            "https://spotify-clone-six-gilt-39.vercel.app"
        ];

        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

app.get("/ping", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/user", userRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;