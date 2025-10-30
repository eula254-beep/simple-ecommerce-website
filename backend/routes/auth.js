// handling user registration and login
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'secretkey123';

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({ name: username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'username and password are required' });

        const user = await User.findOne({ name: username });
        if (!user) return res.status(400).json({ message: 'user not found' });

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) return res.status(400).json({ message: 'wrong password' });

        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;