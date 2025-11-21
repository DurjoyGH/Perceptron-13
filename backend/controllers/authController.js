const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  try {
    const { name, email, studentID, password } = req.body;

    // Validation
    if (!name || !email || !studentID || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { studentID }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or student ID already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      studentID,
      password: hashedPassword,
      role: 'user' // Default role is user
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentID: user.studentID,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and password are required'
      });
    }

    // Find user by studentID (email field is used for studentID in login)
    // If input is 6 digits, treat as studentID, otherwise as email
    const isStudentID = /^\d{6}$/.test(email);
    const user = await User.findOne(
      isStudentID 
        ? { studentID: email }
        : { email: email }
    );
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentID: user.studentID,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message
    });
  }
};

// Logout (client-side will remove token)
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
