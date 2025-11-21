const TourSchedule = require('../models/tourSchedule');
const { cloudinary } = require('../configs/cloudinary');

// Get all tour schedules
const getAllSchedules = async (req, res) => {
  try {
    const { status, isActive } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const schedules = await TourSchedule.find(query).sort({ day: 1 });
    
    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get all schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tour schedules',
      error: error.message
    });
  }
};

// Get single schedule by day
const getScheduleByDay = async (req, res) => {
  try {
    const { day } = req.params;
    
    const schedule = await TourSchedule.findOne({ day: parseInt(day) });
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found for this day'
      });
    }

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Get schedule by day error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule',
      error: error.message
    });
  }
};

// Create new schedule
const createSchedule = async (req, res) => {
  try {
    const { day, date, dateObj, title, location, status, events } = req.body;

    // Validate required fields
    if (!day || !date || !dateObj || !title || !location) {
      return res.status(400).json({
        success: false,
        message: 'Day, date, dateObj, title, and location are required'
      });
    }

    // Check if schedule for this day already exists
    const existingSchedule = await TourSchedule.findOne({ day });
    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: `Schedule for Day ${day} already exists`
      });
    }

    const schedule = await TourSchedule.create({
      day,
      date,
      dateObj: new Date(dateObj),
      title,
      location,
      status: status || 'upcoming',
      events: events || []
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
      error: error.message
    });
  }
};

// Update schedule
const updateSchedule = async (req, res) => {
  try {
    const { day } = req.params;
    const updateData = req.body;

    // If dateObj is being updated, convert to Date object
    if (updateData.dateObj) {
      updateData.dateObj = new Date(updateData.dateObj);
    }

    const schedule = await TourSchedule.findOneAndUpdate(
      { day: parseInt(day) },
      updateData,
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update schedule',
      error: error.message
    });
  }
};

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
    const { day } = req.params;

    const schedule = await TourSchedule.findOneAndDelete({ day: parseInt(day) });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete schedule',
      error: error.message
    });
  }
};

// Add event to schedule
const addEvent = async (req, res) => {
  try {
    const { day } = req.params;
    const { time, title, description, type, status } = req.body;

    if (!time || !title) {
      return res.status(400).json({
        success: false,
        message: 'Time and title are required'
      });
    }

    const schedule = await TourSchedule.findOne({ day: parseInt(day) });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    schedule.events.push({
      time,
      title,
      description: description || '',
      type: type || 'activity',
      status: status || 'upcoming'
    });

    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Event added successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Add event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add event',
      error: error.message
    });
  }
};

// Update event in schedule
const updateEvent = async (req, res) => {
  try {
    const { day, eventId } = req.params;
    const updateData = req.body;

    const schedule = await TourSchedule.findOne({ day: parseInt(day) });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    const event = schedule.events.id(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Update event fields
    Object.keys(updateData).forEach(key => {
      event[key] = updateData[key];
    });

    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// Delete event from schedule
const deleteEvent = async (req, res) => {
  try {
    const { day, eventId } = req.params;

    const schedule = await TourSchedule.findOne({ day: parseInt(day) });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Remove the event using pull
    schedule.events.pull(eventId);
    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

// Get schedule statistics
const getScheduleStats = async (req, res) => {
  try {
    const total = await TourSchedule.countDocuments();
    const completed = await TourSchedule.countDocuments({ status: 'completed' });
    const ongoing = await TourSchedule.countDocuments({ status: 'ongoing' });
    const upcoming = await TourSchedule.countDocuments({ status: 'upcoming' });
    const cancelled = await TourSchedule.countDocuments({ status: 'cancelled' });
    
    // Count total events across all schedules
    const allSchedules = await TourSchedule.find();
    let totalEvents = 0;
    let completedEvents = 0;
    let upcomingEvents = 0;

    allSchedules.forEach(schedule => {
      totalEvents += schedule.events.length;
      completedEvents += schedule.events.filter(e => e.status === 'completed').length;
      upcomingEvents += schedule.events.filter(e => e.status === 'upcoming').length;
    });

    res.status(200).json({
      success: true,
      data: {
        schedules: {
          total,
          completed,
          ongoing,
          upcoming,
          cancelled
        },
        events: {
          total: totalEvents,
          completed: completedEvents,
          upcoming: upcomingEvents
        }
      }
    });
  } catch (error) {
    console.error('Get schedule stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule statistics',
      error: error.message
    });
  }
};

// Add image to gallery
const addGalleryImage = async (req, res) => {
  try {
    const { day } = req.params;
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const schedule = await TourSchedule.findOne({ day: parseInt(day) });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Upload image to Cloudinary using buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tour-gallery',
          transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Add image to gallery
    schedule.gallery.push({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      caption: caption || ''
    });

    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Image added to gallery successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Add gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add image to gallery',
      error: error.message
    });
  }
};

// Update gallery image caption
const updateGalleryImage = async (req, res) => {
  try {
    const { day, imageId } = req.params;
    const { caption } = req.body;

    const schedule = await TourSchedule.findOne({ day: parseInt(day) });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    const image = schedule.gallery.id(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    image.caption = caption || '';
    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Image caption updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image caption',
      error: error.message
    });
  }
};

// Delete image from gallery
const deleteGalleryImage = async (req, res) => {
  try {
    const { day, imageId } = req.params;

    const schedule = await TourSchedule.findOne({ day: parseInt(day) });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    const image = schedule.gallery.id(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
    }

    // Remove image from gallery array
    schedule.gallery.pull(imageId);
    await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};

module.exports = {
  getAllSchedules,
  getScheduleByDay,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  addEvent,
  updateEvent,
  deleteEvent,
  getScheduleStats,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
};
