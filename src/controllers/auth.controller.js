const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { hashPassword, comparePassword } = require('../utils/bcrypt');

const { registervalidation, loginvalidation } = require('../validators/auth.validator');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { error } = registervalidation(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();
    const token = jwt.sign({ userId: savedUser._id }, config.jwtSecret, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginvalidation(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '7d' });

    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};