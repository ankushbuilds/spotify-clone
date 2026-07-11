const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
async function becomeArtist(req, res) {
    try {

        const user = await User.findById(
            req.user.id
        );
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });

        }
        user.role = "artist";
        await user.save();
        const token = jwt.sign(

            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }

        );

        res.json({
            message: "Now you are artist",
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

// Deleting a User
async function deleteUser(req, res) {

    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
async function updateUser(req, res) {

    try {
        console.log("ID:", req.params.id);
        console.log("BODY:", req.body);

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                username: req.body.username,
                email: req.body.email
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.log("UPDATE ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// Update Pass
async function updatePassword(req, res) {
    try {
        const user = await User.findById(req.params.id);

        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10
        );

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = { becomeArtist, deleteUser, updateUser, updatePassword };