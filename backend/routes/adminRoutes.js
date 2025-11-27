const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Get all users
router.get('/users', adminController.getAllUsers);

// Get user statistics
router.get('/stats', adminController.getUserStats);

// Send email to all members
router.post('/send-email-all', adminController.sendEmailToAll);

// Send email to selected members
router.post('/send-email-selected', adminController.sendEmailToSelected);

// Update user role
router.patch('/users/:userId/role', adminController.updateUserRole);

// Reset user password
router.post('/users/:userId/reset-password', adminController.resetUserPassword);

// Sender email management routes
router.get('/sender-emails', adminController.getSenderEmails);
router.post('/sender-emails', adminController.addSenderEmail);
router.patch('/sender-emails/:senderEmailId', adminController.updateSenderEmail);
router.patch('/sender-emails/:senderEmailId/set-default', adminController.setDefaultSenderEmail);
router.patch('/sender-emails/:senderEmailId/remove-default', adminController.removeDefaultSenderEmail);
router.delete('/sender-emails/:senderEmailId', adminController.deleteSenderEmail);

module.exports = router;
