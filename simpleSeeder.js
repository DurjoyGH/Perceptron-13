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

// Tour schedule data
const tourSchedules = [
  {
    day: 1,
    date: 'December 04 (Thursday)',
    dateObj: new Date('2025-12-04'),
    title: 'Departure from Campus',
    location: 'Campus to Cox\'s Bazar (Bus Journey)',
    status: 'upcoming',
    events: [
      { time: '07:00 PM', title: 'Start journey for Cox\'s Bazar from campus', description: 'Departure by bus from campus', type: 'departure', status: 'upcoming' },
      { time: 'Various', title: 'Short washroom break', description: 'Rest stops during the journey', type: 'break', status: 'upcoming' },
      { time: 'Overnight', title: 'Overnight on the bus', description: 'Rest and travel overnight', type: 'accommodation', status: 'upcoming' }
    ]
  },
  {
    day: 2,
    date: 'December 05 (Friday)',
    dateObj: new Date('2025-12-05'),
    title: 'Arrival at Cox\'s Bazar',
    location: 'Cox\'s Bazar',
    status: 'upcoming',
    events: [
      { time: 'Morning', title: 'Breakfast at local restaurant', description: 'Morning meal after arrival', type: 'meal', status: 'upcoming' },
      { time: '10:00 AM - 12:00 PM', title: 'Arrival at Cox\'s Bazar', description: 'Arrival and initial setup', type: 'arrival', status: 'upcoming' },
      { time: 'Afternoon', title: 'Room check-in & freshen up', description: 'Hotel check-in and rest', type: 'accommodation', status: 'upcoming' },
      { time: 'Lunch', title: 'Lunch', description: 'Afternoon meal', type: 'meal', status: 'upcoming' },
      { time: 'Afternoon', title: 'Sightseeing: Laboni Beach, Sugandha Beach & Kolatoli Beach', description: 'Beach exploration and sightseeing', type: 'sightseeing', status: 'upcoming' },
      { time: 'Dinner', title: 'Dinner', description: 'Evening meal', type: 'meal', status: 'upcoming' },
      { time: 'Overnight', title: 'Overnight at hotel', description: 'Rest at hotel accommodation', type: 'accommodation', status: 'upcoming' }
    ]
  },
  {
    day: 3,
    date: 'December 06 (Saturday)',
    dateObj: new Date('2025-12-06'),
    title: 'Saint Martin\'s Island Trip',
    location: 'Saint Martin\'s Island',
    status: 'upcoming',
    events: [
      { time: 'Morning', title: 'Depart for Saint Martin\'s Island by ship', description: 'Ship journey to the island', type: 'travel', status: 'upcoming' },
      { time: 'Breakfast', title: 'Breakfast on the way', description: 'Meal during ship journey', type: 'meal', status: 'upcoming' },
      { time: 'Lunch', title: 'Lunch', description: 'Afternoon meal on the island', type: 'meal', status: 'upcoming' },
      { time: 'Full Day', title: 'Full-day Island exploration', description: 'Exploring Saint Martin\'s Island', type: 'sightseeing', status: 'upcoming' },
      { time: 'Dinner', title: 'Dinner', description: 'Evening meal', type: 'meal', status: 'upcoming' },
      { time: 'Overnight', title: 'Overnight at hotel on Saint Martin\'s', description: 'Rest at island hotel', type: 'accommodation', status: 'upcoming' }
    ]
  },
  {
    day: 4,
    date: 'December 07 (Sunday)',
    dateObj: new Date('2025-12-07'),
    title: 'Chera Dwip & Barbecue Night',
    location: 'Saint Martin\'s Island',
    status: 'upcoming',
    events: [
      { time: '08:00 AM', title: 'Breakfast', description: 'Morning meal', type: 'meal', status: 'upcoming' },
      { time: '09:00 AM', title: 'Visit Chera Dwip', description: 'Local transport to Chera Dwip', type: 'sightseeing', status: 'upcoming' },
      { time: 'Lunch', title: 'Lunch', description: 'Afternoon meal', type: 'meal', status: 'upcoming' },
      { time: 'Night', title: 'Barbecue dinner', description: 'Special barbecue dinner event', type: 'special', status: 'upcoming' },
      { time: 'Overnight', title: 'Overnight at hotel on Saint Martin\'s', description: 'Rest at island hotel', type: 'accommodation', status: 'upcoming' }
    ]
  },
  {
    day: 5,
    date: 'December 08 (Monday)',
    dateObj: new Date('2025-12-08'),
    title: 'Return to Cox\'s Bazar',
    location: 'Saint Martin\'s Island to Cox\'s Bazar',
    status: 'upcoming',
    events: [
      { time: '08:00 AM', title: 'Breakfast', description: 'Morning meal', type: 'meal', status: 'upcoming' },
      { time: 'Morning', title: 'Free time for exploration', description: 'Personal exploration time', type: 'leisure', status: 'upcoming' },
      { time: 'After Lunch', title: 'Return to Cox\'s Bazar by ship', description: 'Ship journey back to Cox\'s Bazar', type: 'travel', status: 'upcoming' },
      { time: 'Dinner', title: 'Dinner', description: 'Evening meal', type: 'meal', status: 'upcoming' },
      { time: 'Overnight', title: 'Overnight at hotel', description: 'Rest at Cox\'s Bazar hotel', type: 'accommodation', status: 'upcoming' }
    ]
  },
  {
    day: 6,
    date: 'December 09 (Tuesday)',
    dateObj: new Date('2025-12-09'),
    title: 'Industrial Visit',
    location: 'Cox\'s Bazar',
    status: 'upcoming',
    events: [
      { time: 'Breakfast', title: 'Breakfast at hotel', description: 'Morning meal', type: 'meal', status: 'upcoming' },
      { time: '10:30 AM - 01:00 PM', title: 'Industrial visit (Submarine Cable Station)', description: 'Educational industrial visit', type: 'industrial', status: 'upcoming' },
      { time: 'Lunch', title: 'Lunch', description: 'Afternoon meal', type: 'meal', status: 'upcoming' },
      { time: '02:30 PM - Evening', title: 'Visit Dorianagar', description: 'Cultural and sightseeing visit', type: 'sightseeing', status: 'upcoming' },
      { time: 'Evening', title: 'Return to hotel', description: 'Return after sightseeing', type: 'travel', status: 'upcoming' },
      { time: '09:00 PM', title: 'Dinner', description: 'Evening meal', type: 'meal', status: 'upcoming' },
      { time: 'Overnight', title: 'Overnight at hotel', description: 'Rest at hotel', type: 'accommodation', status: 'upcoming' }
    ]
  },
  {
    day: 7,
    date: 'December 10 (Wednesday)',
    dateObj: new Date('2025-12-10'),
    title: 'Marine Drive & Beach Exploration',
    location: 'Cox\'s Bazar',
    status: 'upcoming',
    events: [
      { time: '05:30 AM', title: 'Start Marine Drive Tour', description: 'Early morning marine drive exploration', type: 'sightseeing', status: 'upcoming' },
      { time: '08:30 AM', title: 'Breakfast at Shah Porir Dwip', description: 'Meal at scenic location', type: 'meal', status: 'upcoming' },
      { time: '09:00 AM - 11:00 AM', title: 'Explore Shah Porir Dwip', description: 'Island exploration', type: 'sightseeing', status: 'upcoming' },
      { time: '01:00 PM', title: 'Lunch at Himchori', description: 'Afternoon meal', type: 'meal', status: 'upcoming' },
      { time: '01:30 PM - 03:30 PM', title: 'Explore Himchori', description: 'Beach and area exploration', type: 'sightseeing', status: 'upcoming' },
      { time: '04:00 PM', title: 'Visit Inani Beach', description: 'Beach visit', type: 'sightseeing', status: 'upcoming' },
      { time: 'Evening', title: 'Return to hotel', description: 'Return after exploration', type: 'travel', status: 'upcoming' },
      { time: '09:00 PM', title: 'Dinner', description: 'Evening meal', type: 'meal', status: 'upcoming' },
      { time: 'Overnight', title: 'Overnight at hotel', description: 'Rest at hotel', type: 'accommodation', status: 'upcoming' }
    ]
  },
  {
    day: 8,
    date: 'December 11 (Thursday)',
    dateObj: new Date('2025-12-11'),
    title: 'Free for Shopping',
    location: 'Cox\'s Bazar',
    status: 'upcoming',
    events: [
      { time: '08:00 AM', title: 'Breakfast', description: 'Morning meal', type: 'meal', status: 'upcoming' },
      { time: 'Morning', title: 'Checkout', description: 'Hotel checkout', type: 'accommodation', status: 'upcoming' },
      { time: 'Morning', title: 'Book 5 rooms for storing goods', description: 'Storage arrangement for shopping', type: 'activity', status: 'upcoming' },
      { time: '02:00 PM', title: 'Lunch', description: 'Afternoon meal', type: 'meal', status: 'upcoming' },
      { time: 'Full Day', title: 'Shopping & free time', description: 'Personal shopping and leisure activities', type: 'shopping', status: 'upcoming' },
      { time: '06:00 PM', title: 'Start return journey for campus', description: 'Departure back to campus', type: 'departure', status: 'upcoming' },
      { time: 'Dinner', title: 'Dinner (Possible: Chittagong – Mejban)', description: 'Evening meal, possibly traditional Bengali feast', type: 'meal', status: 'upcoming' },
      { time: 'Overnight', title: 'Overnight on the bus', description: 'Overnight travel back to campus', type: 'accommodation', status: 'upcoming' }
    ]
  },
  {
    day: 9,
    date: 'December 12 (Friday)',
    dateObj: new Date('2025-12-12'),
    title: 'Return to Campus',
    location: 'Campus',
    status: 'upcoming',
    events: [
      { time: 'Morning', title: 'Arrive safely at campus', description: 'Safe arrival and completion of tour', type: 'completion', status: 'upcoming' }
    ]
  }
];

// Main execution
async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb+srv://durjoyghosh328:xWXlDi07bJ0iUGwB@cluster0.kxfmvif.mongodb.net/VoterX');

    console.log('Clearing existing tour schedules...');
    await TourSchedule.deleteMany({});

    console.log('Seeding tour schedules...');
    const createdSchedules = await TourSchedule.insertMany(tourSchedules);

    console.log(`Successfully seeded ${createdSchedules.length} tour schedules:`);
    createdSchedules.forEach(schedule => {
      console.log(`Day ${schedule.day}: ${schedule.title} - ${schedule.events.length} events`);
    });

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedData();