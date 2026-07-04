const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =======================
// REGISTER USER
// =======================
async function registerUser(req, res) {
    try {
        const { username, email, password, role = "user" } = req.body;

        const isUserExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserExist) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}

// =======================
// LOGIN USER
// =======================
async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        console.log('[auth.login] incoming body:', { username, email, password: password ? '***' : undefined });

        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        console.log('[auth.login] found user:', user ? { id: user._id, username: user.username, email: user.email } : null);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('[auth.login] password valid:', !!isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}

// =======================
// LOGOUT USER
// =======================
async function logoutUser(req, res) {
    try {
        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};