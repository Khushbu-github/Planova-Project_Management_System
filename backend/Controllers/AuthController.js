// AuthController.js
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password, role, semester } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        if (role === 'student') {
            if (semester === undefined || isNaN(Number(semester)) || ![1,2,3,4,5,6,7,8].includes(Number(semester))) {
                return res.status(400).json({ message: 'Valid semester is required (1-8)', success: false });
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
            name,
            email,
            password: hashedPassword,
            role,
            ...(role === 'student' && { semester: Number(semester) })
        };

        const newUser = new User(userData);
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully', success: true });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        const user = await User.findOne({ email });
        if (!user || user.role !== role) {
            return res.status(400).json({ message: 'Authentication failed', success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Authentication failed', success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        const responseUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            ...(user.role === 'student' && { semester: user.semester })
        };

        return res.status(200).json({ message: 'Login successful', success: true, token, user: responseUser });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = { signup, login };
