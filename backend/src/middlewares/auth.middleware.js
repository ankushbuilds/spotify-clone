const jwt = require('jsonwebtoken');

async function authArtist(req, res, next) {
    const token = req.cookies.token;
   

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You do not have access"
            })
        }

        req.user = decoded; // modifying the request object to include the decoded user information
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}

// Authentication for getting all musics
async function authUser(req, res, next){
    console.log("cookies:", req.cookies);
    const token = req.cookies.token;
     console.log("token: " , token);
     

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("DECODED TOKEN 👉", decoded);
        if(decoded.role !== "user"){
            return res.status(403).json({
                message: "You do not have access"
            })
        }
        req.user = decoded;
        console.log("authuser passed");
        next();

    }
    catch (err)
{
    console.log(err);
    return res.status(401).json({
        message: "Unauthorized"
    })
}};
module.exports = { authArtist , authUser };