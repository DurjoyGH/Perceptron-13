const express = require('express');
const router = express.Router();
const tourScheduleController = require('../controllers/tourScheduleController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { upload } = require('../configs/cloudinary');

// Public routes - anyone can view schedules
router.get('/schedules', tourScheduleController.getAllSchedules);
router.get('/schedules/:day', tourScheduleController.getScheduleByDay);
router.get('/stats', tourScheduleController.getScheduleStats);

// Admin only routes - require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Schedule management
router.post('/schedules', tourScheduleController.createSchedule);
router.put('/schedules/:day', tourScheduleController.updateSchedule);
router.delete('/schedules/:day', tourScheduleController.deleteSchedule);

// Event management within schedules
router.post('/schedules/:day/events', tourScheduleController.addEvent);
router.put('/schedules/:day/events/:eventId', tourScheduleController.updateEvent);
router.delete('/schedules/:day/events/:eventId', tourScheduleController.deleteEvent);

// Gallery management within schedules
router.post('/schedules/:day/gallery', upload.single('image'), tourScheduleController.addGalleryImage);
router.put('/schedules/:day/gallery/:imageId', tourScheduleController.updateGalleryImage);
router.delete('/schedules/:day/gallery/:imageId', tourScheduleController.deleteGalleryImage);

module.exports = router;
