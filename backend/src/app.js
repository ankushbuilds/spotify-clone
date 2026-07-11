const express = require("express");
const cors = require("cors");



const authRoutes = require("./routes/auth.route");
const musicRoutes = require("./routes/music.route");
const userRoutes = require("./routes/user.route");


const app = express();


// =====================
// MIDDLEWARE
// =====================

app.use(
    cors({
        origin: "http://localhost:5173",
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
        ]
    })
);


app.use(express.json());


app.use(
    express.urlencoded({
        extended:true
    })
);



// =====================
// LOGGER
// =====================

app.use((req,res,next)=>{

    console.log(
        `[${req.method}] ${req.originalUrl}`
    );

    next();

});



// =====================
// ROUTES
// =====================


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/music",
    musicRoutes
);


app.use(
    "/api/user",
    userRoutes
);



// =====================
// 404 HANDLER
// =====================

app.use((req,res)=>{

    res.status(404).json({

        message:"Route not found",

        path:req.originalUrl

    });

});



// =====================
// ERROR HANDLER
// =====================

app.use((err,req,res,next)=>{


    console.error(err);


    res.status(
        err.status || 500
    )
    .json({

        message:
        err.message ||
        "Internal Server Error"

    });


});



module.exports = app;