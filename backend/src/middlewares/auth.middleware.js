const jwt = require('jsonwebtoken');

function getTokenFromHeader(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1];
}

async function authArtist(req, res, next) {
    const token = getTokenFromHeader(req);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You do not have access"
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

// Authentication for getting all musics
async function authUser(req, res, next) {
    const token = getTokenFromHeader(req);

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "user") {
            return res.status(403).json({
                message: "You do not have access"
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};

module.exports = { authArtist, authUser };