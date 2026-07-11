const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const userController = require("../controllers/user.controller");



router.put(
    "/become-artist",

    authMiddleware.auth,

    userController.becomeArtist
);

// Deleting User
router.delete(
    "/delete/:id",
    userController.deleteUser
)

// Updating User
router.put(
    "/update/:id",
    userController.updateUser
)

// Updating Password
router.put(
    "/update-password/:id",
    userController.updatePassword
)



module.exports = router;