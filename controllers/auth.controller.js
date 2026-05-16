const User = require('../models/user.model'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation

const {
   registervalidation, 
   loginvalidation } = require('../validators/auth.validator'); // Import validation functions


// User registration controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; 

    // Validate the input data
    const { error } = registervalidation(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
}
    
    const hashedPassword = await bcrypt.hash(password, 10); 

    // Create and save a new user
    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'JWT_SECRET not configured' });
    }

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Return token and basic user info (without password)
    res.status(201).json({ success: true, message: 'User registered successfully', token, user: { id: savedUser._id, name: savedUser.name, email: savedUser.email } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
    };

// User login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the input data
    const { error } = loginvalidation(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};