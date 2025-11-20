const User = require('../models/user');
const sendEmail = require('../services/emailService');
const { getEmailTemplate } = require('../utils/emailTemplate');

// Get all users (members)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    
    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        admins: adminCount,
        users: userCount,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

// Send email to all members
const sendEmailToAll = async (req, res) => {
  try {
    const { subject, message, emailType = 'general' } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // Get all users
    const users = await User.find({ role: 'user' }).select('email name');

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found to send email'
      });
    }

    const emailPromises = [];
    const failedEmails = [];

    // Send emails to all users
    for (const user of users) {
      const htmlContent = getEmailTemplate({
        title: subject,
        userName: user.name,
        content: message,
        type: emailType
      });

      const emailPromise = sendEmail({
        to: user.email,
        subject: subject,
        text: message,
        html: htmlContent
      }).catch(error => {
        console.error(`Failed to send email to ${user.email}:`, error);
        failedEmails.push({ email: user.email, name: user.name });
      });

      emailPromises.push(emailPromise);
    }

    await Promise.allSettled(emailPromises);

    const successCount = users.length - failedEmails.length;

    res.status(200).json({
      success: true,
      message: `Email sent to ${successCount} out of ${users.length} users`,
      data: {
        totalUsers: users.length,
        successCount,
        failedCount: failedEmails.length,
        failedEmails
      }
    });

  } catch (error) {
    console.error('Send email to all error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails',
      error: error.message
    });
  }
};

// Send email to specific users
const sendEmailToSelected = async (req, res) => {
  try {
    const { userIds, subject, message, emailType = 'general' } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // Get selected users
    const users = await User.find({ 
      _id: { $in: userIds },
      role: 'user' 
    }).select('email name');

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found with the provided IDs'
      });
    }

    const emailPromises = [];
    const failedEmails = [];

    // Send emails to selected users
    for (const user of users) {
      const htmlContent = getEmailTemplate({
        title: subject,
        userName: user.name,
        content: message,
        type: emailType
      });

      const emailPromise = sendEmail({
        to: user.email,
        subject: subject,
        text: message,
        html: htmlContent
      }).catch(error => {
        console.error(`Failed to send email to ${user.email}:`, error);
        failedEmails.push({ email: user.email, name: user.name });
      });

      emailPromises.push(emailPromise);
    }

    await Promise.allSettled(emailPromises);

    const successCount = users.length - failedEmails.length;

    res.status(200).json({
      success: true,
      message: `Email sent to ${successCount} out of ${users.length} selected users`,
      data: {
        totalUsers: users.length,
        successCount,
        failedCount: failedEmails.length,
        failedEmails
      }
    });

  } catch (error) {
    console.error('Send email to selected error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails',
      error: error.message
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role (admin or user) is required'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  sendEmailToAll,
  sendEmailToSelected,
  updateUserRole
};
