const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. Please login.',
        code: 'NO_TOKEN'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found. Please login again.',
          code: 'USER_NOT_FOUND'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      // Check if token is expired
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Access token expired. Please refresh your token.',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      // Other JWT errors (invalid signature, malformed, etc.)
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Please login again.',
        code: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed. Please login again.',
      code: 'AUTH_ERROR'
    });
  }
};

module.exports = authMiddleware;
