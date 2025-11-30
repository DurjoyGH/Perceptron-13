const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../services/emailService');
const crypto = require('crypto');

// In-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map();

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

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generate refresh token (7 days)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

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
        accessToken,
        refreshToken
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
    let { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Student ID/Faculty ID and password are required'
      });
    }

    // Trim whitespace from studentID/facultyID
    email = email.trim();

    let user = null;
    
    // Check if it's a faculty ID (starts with "FACULTY")
    if (email.toUpperCase().startsWith('FACULTY')) {
      // For faculty, only allow login by faculty ID (case-insensitive)
      user = await User.findOne({ 
        studentID: { $regex: new RegExp(`^${email}$`, 'i') },
        type: 'faculty'
      });
    } else {
      // For all users, only allow login by studentID
      user = await User.findOne({ studentID: email });
    }
    
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

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generate refresh token (7 days)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

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
        accessToken,
        refreshToken
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

// Refresh access token
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: {
        accessToken
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
};

// Logout (clear refresh token from database)
const logout = async (req, res) => {
  try {
    // Clear refresh token from database
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
      error: error.message
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Student ID or Faculty ID is required'
      });
    }

    email = email.trim();
    let user = null;
    
    // Check if it's a faculty ID (starts with "FACULTY")
    if (email.toUpperCase().startsWith('FACULTY')) {
      user = await User.findOne({ 
        studentID: { $regex: new RegExp(`^${email}$`, 'i') },
        type: 'faculty'
      });
    } else {
      // For all users, only search by studentID
      user = await User.findOne({ studentID: email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this Student ID or Faculty ID'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('Generated OTP for password reset:', { email: user.email, otp, userId: user._id });
    
    // Store OTP with expiration (5 minutes)
    const otpData = {
      otp,
      userId: user._id,
      email: user.email,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };
    
    otpStorage.set(user.email, otpData);
    console.log('OTP stored with key:', user.email);

    // Send OTP email
    const emailSubject = 'Password Reset OTP - Perceptron-13';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #19aaba; margin: 0; font-size: 28px;">Perceptron-13</h1>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Industrial Tour 2025</p>
          </div>
          
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hello <strong>${user.name}</strong>,
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: linear-gradient(135deg, #19aaba 0%, #158c99 100%); color: white; padding: 20px 40px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 3px; box-shadow: 0 4px 15px rgba(25, 170, 186, 0.3);">
              ${otp}
            </div>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px; text-align: center;">
              <strong>⚠️ Important:</strong> This OTP will expire in <strong>5 minutes</strong>
            </p>
          </div>
          
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            This is an automated email from Perceptron-13 Tour Management System.<br>
            Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: emailSubject,
      html: emailHtml
    });

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address',
      data: {
        email: user.email, // Send actual email for verification
        maskedEmail: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Send masked for display
      }
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset email',
      error: error.message
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('Verify OTP Request:', { email, otp, timestamp: new Date().toISOString() });

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const otpData = otpStorage.get(email);
    console.log('Stored OTP Data:', otpData ? { ...otpData, otp: '***' } : 'Not found');
    console.log('Available OTP keys:', Array.from(otpStorage.keys()));
    
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (Date.now() > otpData.expiresAt) {
      console.log('OTP expired:', { now: Date.now(), expiresAt: otpData.expiresAt });
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    console.log('OTP Comparison:', { received: otp, stored: otpData.otp, match: otpData.otp === otp });

    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Update OTP data with reset token
    otpData.resetToken = resetToken;
    otpData.resetTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStorage.set(email, otpData);

    console.log('OTP verified successfully for email:', email);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        resetToken
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find OTP data with matching reset token
    let otpData = null;
    let userEmail = null;
    
    for (const [email, data] of otpStorage.entries()) {
      if (data.resetToken === resetToken) {
        otpData = data;
        userEmail = email;
        break;
      }
    }

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    if (Date.now() > otpData.resetTokenExpiresAt) {
      otpStorage.delete(userEmail);
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired. Please start over.'
      });
    }

    // Find user and update password
    const user = await User.findById(otpData.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Clean up OTP data
    otpStorage.delete(userEmail);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword
};
