const mongoose = require('mongoose');

// Define the schema inline
const eventSchema = new mongoose.Schema({
  time: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['departure', 'arrival', 'meal', 'accommodation', 'sightseeing', 'activity', 'industrial', 'travel', 'break', 'shopping', 'leisure', 'special', 'completion'], default: 'activity' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled', 'delayed'], default: 'upcoming' }
}, { _id: true });

const tourScheduleSchema = new mongoose.Schema({
  day: { type: Number, required: true, unique: true },
  date: { type: String, required: true },
  dateObj: { type: Date, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  events: [eventSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const TourSchedule = mongoose.model('TourSchedule', tourScheduleSchema);

async function checkData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb+srv://durjoyghosh328:xWXlDi07bJ0iUGwB@cluster0.kxfmvif.mongodb.net/VoterX');

    console.log('Checking tour schedules...');
    const schedules = await TourSchedule.find({}).sort({ day: 1 });

    console.log(`Found ${schedules.length} tour schedules:`);
    schedules.forEach(schedule => {
      console.log(`Day ${schedule.day}: ${schedule.title} - ${schedule.events.length} events`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

checkData();