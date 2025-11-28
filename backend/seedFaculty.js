const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Faculty = require('./models/faculty');
const User = require('./models/user');
require('dotenv').config();

const connectDB = require('./configs/db');

const facultyData = [
  {
    facultyID: "FACULTY001",
    name: "Dr. Mohammad Abdul Awal",
    email: "awal.cse@example.edu",
    // User credentials
    userEmail: "awal.cse@example.edu",
    studentID: "FACULTY001",
    password: "Faculty@123",
    gender: "male"
  },
  {
    facultyID: "FACULTY002",
    name: "Dr. Sharmin Akter",
    email: "sharmin.akter@example.edu",
    // User credentials
    userEmail: "sharmin.akter@example.edu",
    studentID: "FACULTY002",
    password: "Faculty@123",
    gender: "female"
  }
];

const seedFaculty = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing faculty data
    await Faculty.deleteMany({});
    console.log('Cleared existing faculty data');

    // Clear existing faculty user accounts
    await User.deleteMany({ type: 'faculty' });
    console.log('Cleared existing faculty user accounts');

    for (const facultyInfo of facultyData) {
      // Create Faculty profile with only basic required fields
      const faculty = new Faculty({
        facultyID: facultyInfo.facultyID,
        name: facultyInfo.name,
        email: facultyInfo.email
      });

      await faculty.save();
      console.log(`✓ Created faculty profile: ${facultyInfo.name}`);

      // Create User account for login
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(facultyInfo.password, salt);

      const user = new User({
        name: facultyInfo.name,
        gender: facultyInfo.gender,
        email: facultyInfo.userEmail,
        type: 'faculty',
        studentID: facultyInfo.studentID,
        password: hashedPassword,
        role: 'user' // Faculty members have 'user' role by default
      });

      await user.save();
      console.log(`✓ Created user account: ${facultyInfo.studentID} (Password: ${facultyInfo.password})`);
    }

    console.log('\n✅ Faculty seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('==========================================');
    facultyData.forEach(f => {
      console.log(`\nName: ${f.name}`);
      console.log(`Email: ${f.userEmail}`);
      console.log(`Student ID: ${f.studentID}`);
      console.log(`Password: ${f.password}`);
    });
    console.log('\n==========================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding faculty:', error);
    process.exit(1);
  }
};

seedFaculty();
