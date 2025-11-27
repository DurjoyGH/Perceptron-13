const User = require('../models/user');
const SenderEmail = require('../models/senderEmail');
const bcrypt = require('bcryptjs');
const sendEmail = require('../services/emailService');
const { getEmailTemplate } = require('../utils/emailTemplate');

// Ensure default sender email exists from .env
const ensureDefaultSenderEmail = async () => {
  try {
    const existingDefault = await SenderEmail.findOne({ isDefault: true });
    if (!existingDefault) {
      const count = await SenderEmail.countDocuments();
      if (count === 0 && process.env.EMAIL_USER && process.env.APP_PASSWORD) {
        // Create default sender email from .env
        const defaultSender = new SenderEmail({
          displayName: process.env.EMAIL_DISPLAY_NAME || 'Perceptron-13',
          email: process.env.EMAIL_USER,
          password: process.env.APP_PASSWORD,
          smtpHost: process.env.EMAIL_SMTP_HOST || 'smtp.gmail.com',
          smtpPort: parseInt(process.env.EMAIL_SMTP_PORT) || 465,
          isDefault: true,
          createdBy: '000000000000000000000000' // System created
        });
        await defaultSender.save();
        console.log('Default sender email created from .env');
      }
    }
  } catch (error) {
    console.error('Error ensuring default sender email:', error);
  }
};

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
    const { subject, message, senderEmailId } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    // Get sender email config
    let senderConfig = null;
    if (senderEmailId) {
      senderConfig = await SenderEmail.findById(senderEmailId);
      if (!senderConfig || !senderConfig.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or inactive sender email selected'
        });
      }
    } else {
      // Use default sender email if none selected
      senderConfig = await SenderEmail.findOne({ isDefault: true, isActive: true });
      if (!senderConfig) {
        return res.status(400).json({
          success: false,
          message: 'No default sender email configured. Please select a sender email.'
        });
      }
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
        content: message
      });

      const emailPromise = sendEmail({
        to: user.email,
        subject: subject,
        text: message,
        html: htmlContent,
        senderConfig
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
    const { userIds, subject, message, senderEmailId } = req.body;

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

    // Get sender email config
    let senderConfig = null;
    if (senderEmailId) {
      senderConfig = await SenderEmail.findById(senderEmailId);
      if (!senderConfig || !senderConfig.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or inactive sender email selected'
        });
      }
    } else {
      // Use default sender email if none selected
      senderConfig = await SenderEmail.findOne({ isDefault: true, isActive: true });
      if (!senderConfig) {
        return res.status(400).json({
          success: false,
          message: 'No default sender email configured. Please select a sender email.'
        });
      }
    }

    // Get selected users (including admins)
    const users = await User.find({ 
      _id: { $in: userIds }
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
        content: message
      });

      const emailPromise = sendEmail({
        to: user.email,
        subject: subject,
        text: message,
        html: htmlContent,
        senderConfig
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

// Reset user password (Admin only)
const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate a random 8-character password
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase().slice(0, 4);
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Send email with new password
    const emailContent = `Your password has been reset by an administrator.

Your new login credentials are:
Student ID: ${user.studentID}
Email: ${user.email}
New Password: ${randomPassword}

Please log in using your new password and change it immediately from your profile settings for security purposes.

If you did not request this password reset, please contact the administrator immediately.`;

    const htmlContent = getEmailTemplate({
      title: 'Password Reset - Perceptron-13',
      userName: user.name,
      content: emailContent
    });

    try {
      await sendEmail({
        to: user.email,
        subject: 'Your Password Has Been Reset - Perceptron-13',
        text: emailContent,
        html: htmlContent
      });

      res.status(200).json({
        success: true,
        message: `Password reset successfully. New password has been sent to ${user.email}`,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          newPassword: randomPassword,
          emailSent: true
        }
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Still return success with the password, but indicate email failed
      res.status(200).json({
        success: true,
        message: `Password reset successfully, but failed to send email. Please share the password manually.`,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          newPassword: randomPassword,
          emailSent: false
        }
      });
    }

  } catch (error) {
    console.error('Reset user password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset user password',
      error: error.message
    });
  }
};

// Get all sender emails
const getSenderEmails = async (req, res) => {
  try {
    // Ensure default sender email exists
    await ensureDefaultSenderEmail();
    
    const senderEmails = await SenderEmail.find()
      .select('-password')
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: senderEmails.length,
      data: senderEmails
    });
  } catch (error) {
    console.error('Get sender emails error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sender emails',
      error: error.message
    });
  }
};

// Add new sender email
const addSenderEmail = async (req, res) => {
  try {
    const { displayName, email, password, smtpHost, smtpPort, isDefault } = req.body;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Display name, email, and password are required'
      });
    }

    // Check if email already exists
    const existingEmail = await SenderEmail.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'This email address is already registered as a sender email'
      });
    }

    const senderEmail = new SenderEmail({
      displayName,
      email,
      password,
      smtpHost: smtpHost || 'smtp.gmail.com',
      smtpPort: smtpPort || 465,
      isDefault: isDefault || false,
      createdBy: req.user._id
    });

    await senderEmail.save();

    // Return without password
    const senderEmailData = senderEmail.toObject();
    delete senderEmailData.password;

    res.status(201).json({
      success: true,
      message: 'Sender email added successfully',
      data: senderEmailData
    });
  } catch (error) {
    console.error('Add sender email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add sender email',
      error: error.message
    });
  }
};

// Update sender email
const updateSenderEmail = async (req, res) => {
  try {
    const { senderEmailId } = req.params;
    const { displayName, email, password, smtpHost, smtpPort, isActive } = req.body;

    const senderEmail = await SenderEmail.findById(senderEmailId);

    if (!senderEmail) {
      return res.status(404).json({
        success: false,
        message: 'Sender email not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== senderEmail.email) {
      const existingEmail = await SenderEmail.findOne({ email, _id: { $ne: senderEmailId } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'This email address is already registered as a sender email'
        });
      }
      senderEmail.email = email;
    }

    if (displayName) senderEmail.displayName = displayName;
    if (password) senderEmail.password = password;
    if (smtpHost) senderEmail.smtpHost = smtpHost;
    if (smtpPort) senderEmail.smtpPort = smtpPort;
    if (typeof isActive !== 'undefined') senderEmail.isActive = isActive;

    await senderEmail.save();

    // Return without password
    const senderEmailData = senderEmail.toObject();
    delete senderEmailData.password;

    res.status(200).json({
      success: true,
      message: 'Sender email updated successfully',
      data: senderEmailData
    });
  } catch (error) {
    console.error('Update sender email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sender email',
      error: error.message
    });
  }
};

// Set default sender email
const setDefaultSenderEmail = async (req, res) => {
  try {
    const { senderEmailId } = req.params;

    const senderEmail = await SenderEmail.findById(senderEmailId);

    if (!senderEmail) {
      return res.status(404).json({
        success: false,
        message: 'Sender email not found'
      });
    }

    if (!senderEmail.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot set an inactive sender email as default'
      });
    }

    // Remove default from all other sender emails
    await SenderEmail.updateMany({}, { isDefault: false });

    // Set this one as default
    senderEmail.isDefault = true;
    await senderEmail.save();

    // Return without password
    const senderEmailData = senderEmail.toObject();
    delete senderEmailData.password;

    res.status(200).json({
      success: true,
      message: 'Default sender email set successfully',
      data: senderEmailData
    });
  } catch (error) {
    console.error('Set default sender email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default sender email',
      error: error.message
    });
  }
};

// Remove default from sender email
const removeDefaultSenderEmail = async (req, res) => {
  try {
    const { senderEmailId } = req.params;

    const senderEmail = await SenderEmail.findById(senderEmailId);

    if (!senderEmail) {
      return res.status(404).json({
        success: false,
        message: 'Sender email not found'
      });
    }

    if (!senderEmail.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'This sender email is not set as default'
      });
    }

    // Remove default status
    senderEmail.isDefault = false;
    await senderEmail.save();

    // Return without password
    const senderEmailData = senderEmail.toObject();
    delete senderEmailData.password;

    res.status(200).json({
      success: true,
      message: 'Default status removed successfully',
      data: senderEmailData
    });
  } catch (error) {
    console.error('Remove default sender email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove default status',
      error: error.message
    });
  }
};

// Delete sender email
const deleteSenderEmail = async (req, res) => {
  try {
    const { senderEmailId } = req.params;

    const senderEmail = await SenderEmail.findById(senderEmailId);

    if (!senderEmail) {
      return res.status(404).json({
        success: false,
        message: 'Sender email not found'
      });
    }

    await SenderEmail.findByIdAndDelete(senderEmailId);

    res.status(200).json({
      success: true,
      message: 'Sender email deleted successfully'
    });
  } catch (error) {
    console.error('Delete sender email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sender email',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserStats,
  sendEmailToAll,
  sendEmailToSelected,
  updateUserRole,
  resetUserPassword,
  getSenderEmails,
  addSenderEmail,
  updateSenderEmail,
  setDefaultSenderEmail,
  removeDefaultSenderEmail,
  deleteSenderEmail
};
