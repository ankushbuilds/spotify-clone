const jwt = require("jsonwebtoken");

function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}

async function auth(req,res,next) {

  console.log("AUTH HEADER:", req.headers.authorization);

  const token = getTokenFromHeader(req);

  if(!token){
    console.log("TOKEN NOT FOUND");

    return res.status(401).json({
      message:"Unauthorized"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED USER:", decoded);

    req.user = decoded;

    next();

  } catch(error){

    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message:"Invalid token"
    });
  }
}

function authArtist(req,res,next) {
  if(!req.user){
    return res.status(401).json({
      message:"Unauthorized"
    });
  }

  if(req.user.role !== "artist"){
    return res.status(403).json({
      message:"Artist access required"
    });
  }

  next();
}

function authUser(req,res,next) {
  if(!req.user){
    return res.status(401).json({
      message:"Unauthorized"
    });
  }

  if(
    req.user.role !== "user" &&
    req.user.role !== "artist"
  ){
    return res.status(403).json({
      message:"User access required"
    });
  }

  next();
}

module.exports = {
  auth,
  authArtist,
  authUser
};