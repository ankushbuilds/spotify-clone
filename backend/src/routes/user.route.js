const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");



router.put(
    "/become-artist",

    authMiddleware.auth,

    userController.becomeArtist
);



module.exports = router;