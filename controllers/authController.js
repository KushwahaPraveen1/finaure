const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({
        success: true,
        token: generateToken(user._id, user.role),
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
        success: true,
        token: generateToken(user._id, user.role),
        user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
});
