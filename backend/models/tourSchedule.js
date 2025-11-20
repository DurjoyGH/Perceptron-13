const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['departure', 'arrival', 'meal', 'accommodation', 'sightseeing', 'activity', 'industrial', 'travel', 'break', 'shopping', 'leisure', 'special', 'completion'],
    default: 'activity'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled', 'delayed'],
    default: 'upcoming'
  }
}, { _id: true });

const tourScheduleSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  dateObj: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  events: [eventSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
tourScheduleSchema.index({ day: 1 });
tourScheduleSchema.index({ dateObj: 1 });
tourScheduleSchema.index({ status: 1 });

module.exports = mongoose.model('TourSchedule', tourScheduleSchema);
