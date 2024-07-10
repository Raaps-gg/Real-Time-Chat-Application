const bcrypt = require('bcryptjs');
const User = require('../Models/userModel');
const { generateTokenAndSetCookie } = require('../Utils/generateTokens');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

const logoutUser = (req, res) => {
    res.send("Logout Page");
};

const signupUser = async (req, res) => {
    try {
        const { fullname, username, password, confirmpassword, gender } = req.body;

        if (password !== confirmpassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilepic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

module.exports = {
    loginUser,
    logoutUser,
    signupUser,
    getAllUsers,
};
