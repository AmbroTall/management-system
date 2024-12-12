const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models/index');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const {username, email, password, role_id } = req.body;


    try {
        // Check if the user already exists
        const userExist = await User.findOne({ where: { email } });
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        console.log("Taller", req.body)
        
        const user = await User.create({ username, email, password: hashedPassword, role_id:1 });

        // Create a JWT token
        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token in an HTTP-only cookie for security (optional but recommended)
        res.cookie('authToken', token, {
            httpOnly: true,  // Make the cookie accessible only by the server
            secure: process.env.NODE_ENV === 'production',  // Only send over HTTPS in production
            maxAge: 3600000,  // 1 hour expiration (same as JWT expiration)
        });

        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'An error occured during registration' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the entered password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token in an HTTP-only cookie for security (optional)
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,  // Same as JWT expiration time (1 hour)
        });

        res.json({ token });  
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: `Bad request` });
    }
});

module.exports = router;
