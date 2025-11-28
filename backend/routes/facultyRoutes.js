const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { upload } = require('../configs/cloudinary');

// Public routes (no authentication required)
router.get('/', facultyController.getAllFaculty);
router.get('/public/:id', facultyController.getFacultyById);

// Faculty member own profile routes (require authentication)
router.get('/profile/me', authMiddleware, facultyController.getFacultyProfile);
router.put('/profile/me', authMiddleware, facultyController.updateFacultyProfile);
router.put('/profile/me/picture', authMiddleware, upload.single('profilePicture'), facultyController.updateFacultyProfilePicture);
router.delete('/profile/me/picture', authMiddleware, facultyController.deleteOwnFacultyProfilePicture);

// Featured photos routes (require authentication)
router.post('/profile/me/featured-photos', authMiddleware, upload.single('photo'), facultyController.addFacultyFeaturedPhoto);
router.put('/profile/me/featured-photos/:photoId', authMiddleware, facultyController.updateFacultyFeaturedPhoto);
router.delete('/profile/me/featured-photos/:photoId', authMiddleware, facultyController.deleteFacultyFeaturedPhoto);

// Admin routes (require authentication and admin role)
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), facultyController.getAllFacultyAdmin);
router.post('/', authMiddleware, roleMiddleware(['admin']), upload.single('profilePicture'), facultyController.createFaculty);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), upload.single('profilePicture'), facultyController.updateFaculty);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), facultyController.deleteFaculty);
router.delete('/:id/profile-picture', authMiddleware, roleMiddleware(['admin']), facultyController.deleteFacultyProfilePicture);

module.exports = router;
