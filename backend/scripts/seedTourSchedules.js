const mongoose = require('mongoose');
const TourSchedule = require('../models/tourSchedule');
require('dotenv').config();

const seedSchedules = [
  {
    day: 1,
    date: "December 04, 2025",
    dateObj: new Date("2025-12-04"),
    title: "Departure Day",
    location: "JUST Campus → Cox's Bazar",
    status: "upcoming",
    events: [
      { 
        time: "07:00 PM", 
        title: "Start Journey from Campus", 
        type: "departure", 
        description: "Board the bus from JUST campus",
        status: "upcoming"
      },
      { 
        time: "08:00 PM", 
        title: "Washroom Break", 
        type: "break", 
        description: "Short rest stop",
        status: "upcoming"
      },
      { 
        time: "11:00 PM", 
        title: "Overnight Journey", 
        type: "travel", 
        description: "Continue journey to Cox's Bazar",
        status: "upcoming"
      }
    ]
  },
  {
    day: 2,
    date: "December 05, 2025",
    dateObj: new Date("2025-12-05"),
    title: "Arrival at Cox's Bazar",
    location: "Cox's Bazar",
    status: "upcoming",
    events: [
      { time: "08:00 AM", title: "Breakfast", type: "meal", description: "Breakfast at local restaurant", status: "upcoming" },
      { time: "10:00 AM", title: "Arrival at Cox's Bazar", type: "arrival", description: "Reach Cox's Bazar", status: "upcoming" },
      { time: "12:00 PM", title: "Hotel Check-in", type: "accommodation", description: "Check into hotel and freshen up", status: "upcoming" },
      { time: "01:00 PM", title: "Lunch", type: "meal", description: "Lunch at hotel", status: "upcoming" },
      { time: "03:00 PM", title: "Laboni Beach Visit", type: "sightseeing", description: "Explore Laboni Beach", status: "upcoming" },
      { time: "05:00 PM", title: "Sugandha Beach", type: "sightseeing", description: "Visit Sugandha Beach", status: "upcoming" },
      { time: "06:30 PM", title: "Kolatoli Beach", type: "sightseeing", description: "Evening at Kolatoli Beach", status: "upcoming" },
      { time: "08:00 PM", title: "Dinner", type: "meal", description: "Dinner at hotel", status: "upcoming" },
      { time: "10:00 PM", title: "Overnight Stay", type: "accommodation", description: "Rest at hotel", status: "upcoming" }
    ]
  },
  {
    day: 3,
    date: "December 06, 2025",
    dateObj: new Date("2025-12-06"),
    title: "Marine Drive Adventure",
    location: "Marine Drive & Beaches",
    status: "upcoming",
    events: [
      { time: "05:30 AM", title: "Marine Drive Tour Starts", type: "activity", description: "Early morning Marine Drive journey", status: "upcoming" },
      { time: "08:30 AM", title: "Breakfast at Shah Porir Dwip", type: "meal", description: "Breakfast by the beach", status: "upcoming" },
      { time: "09:00 AM", title: "Explore Shah Porir Dwip", type: "sightseeing", description: "Visit Shah Porir Dwip", status: "upcoming" },
      { time: "11:00 AM", title: "Continue Journey", type: "travel", description: "Head towards Himchori", status: "upcoming" },
      { time: "01:00 PM", title: "Lunch at Himchori", type: "meal", description: "Lunch break", status: "upcoming" },
      { time: "01:30 PM", title: "Himchori Exploration", type: "sightseeing", description: "Explore Himchori waterfalls and area", status: "upcoming" },
      { time: "04:00 PM", title: "Inani Beach Visit", type: "sightseeing", description: "Visit beautiful Inani Beach", status: "upcoming" },
      { time: "06:00 PM", title: "Return to Hotel", type: "travel", description: "Journey back to hotel", status: "upcoming" },
      { time: "09:00 PM", title: "Dinner", type: "meal", description: "Dinner at hotel", status: "upcoming" },
      { time: "11:00 PM", title: "Overnight Stay", type: "accommodation", description: "Rest at hotel", status: "upcoming" }
    ]
  },
  {
    day: 4,
    date: "December 07, 2025",
    dateObj: new Date("2025-12-07"),
    title: "Industrial Visit Day",
    location: "Submarine Cable Station & Dorianagar",
    status: "upcoming",
    events: [
      { time: "08:00 AM", title: "Breakfast", type: "meal", description: "Breakfast at hotel", status: "upcoming" },
      { time: "10:30 AM", title: "Submarine Cable Station Visit", type: "industrial", description: "Industrial visit to Submarine Cable Station", status: "upcoming" },
      { time: "01:00 PM", title: "Lunch", type: "meal", description: "Lunch break", status: "upcoming" },
      { time: "02:30 PM", title: "Visit Dorianagar", type: "sightseeing", description: "Explore Dorianagar area", status: "upcoming" },
      { time: "06:00 PM", title: "Return to Hotel", type: "travel", description: "Return journey", status: "upcoming" },
      { time: "09:00 PM", title: "Dinner", type: "meal", description: "Dinner at hotel", status: "upcoming" },
      { time: "11:00 PM", title: "Overnight Stay", type: "accommodation", description: "Rest at hotel", status: "upcoming" }
    ]
  },
  {
    day: 5,
    date: "December 08, 2025",
    dateObj: new Date("2025-12-08"),
    title: "Saint Martin's Island Trip",
    location: "Saint Martin's Island",
    status: "upcoming",
    events: [
      { time: "06:00 AM", title: "Early Morning Departure", type: "departure", description: "Depart for Saint Martin's Island", status: "upcoming" },
      { time: "08:00 AM", title: "Breakfast on Ship", type: "meal", description: "Breakfast during ship journey", status: "upcoming" },
      { time: "11:00 AM", title: "Arrive at Saint Martin's", type: "arrival", description: "Reach Saint Martin's Island", status: "upcoming" },
      { time: "12:00 PM", title: "Hotel Check-in", type: "accommodation", description: "Check into island hotel", status: "upcoming" },
      { time: "01:00 PM", title: "Lunch", type: "meal", description: "Lunch at hotel", status: "upcoming" },
      { time: "03:00 PM", title: "Island Exploration", type: "sightseeing", description: "Full afternoon island exploration", status: "upcoming" },
      { time: "06:00 PM", title: "Beach Evening", type: "sightseeing", description: "Enjoy sunset at the beach", status: "upcoming" },
      { time: "08:00 PM", title: "Dinner", type: "meal", description: "Dinner at hotel", status: "upcoming" },
      { time: "10:00 PM", title: "Overnight Stay", type: "accommodation", description: "Rest at Saint Martin's hotel", status: "upcoming" }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing schedules
    await TourSchedule.deleteMany({});
    console.log('Cleared existing schedules');

    // Insert seed data
    await TourSchedule.insertMany(seedSchedules);
    console.log('Successfully seeded tour schedules');

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
