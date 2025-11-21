const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../configs/cloudinary');

// Public routes (no authentication required)
router.get('/members', userController.getAllMembers);
router.get('/members/:studentId', userController.getMemberByStudentId);

// Protected routes (require authentication)
router.use(authMiddleware);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Update user profile
router.put('/profile', userController.updateUserProfile);

// Profile picture routes
router.put('/profile-picture', upload.single('profilePicture'), userController.updateProfilePicture);
router.delete('/profile-picture', userController.deleteProfilePicture);

// Featured photos routes
router.post('/featured-photos', upload.single('photo'), userController.addFeaturedPhoto);
router.put('/featured-photos/:photoId', userController.updateFeaturedPhoto);
router.delete('/featured-photos/:photoId', userController.deleteFeaturedPhoto);

module.exports = router;
