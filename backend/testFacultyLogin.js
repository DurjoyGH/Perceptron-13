const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

const testFacultyLogin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/perceptron13', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to database');
    
    // Find faculty members
    const facultyMembers = await User.find({ type: 'faculty' });
    console.log(`Found ${facultyMembers.length} faculty members:`);
    
    facultyMembers.forEach((faculty, index) => {
      console.log(`${index + 1}. Name: ${faculty.name}`);
      console.log(`   Faculty ID: ${faculty.studentID}`);
      console.log(`   Designation: ${faculty.designation || 'Not set'}`);
      console.log(`   Department: ${faculty.department || 'Not set'}`);
      console.log(`   Bio: ${faculty.bio ? faculty.bio.substring(0, 50) + '...' : 'Not set'}`);
      console.log(`   Research Interests: ${faculty.researchInterests.length} items`);
      console.log(`   Qualifications: ${faculty.qualifications.length} items`);
      console.log(`   Office Room: ${faculty.officeRoom || 'Not set'}`);
      console.log('---');
    });
    
    // Test case-insensitive search
    const testIds = ['faculty001', 'FACULTY001', 'Faculty001'];
    
    for (const testId of testIds) {
      console.log(`\nTesting login with: ${testId}`);
      
      // Test the regex pattern that should match faculty IDs
      const facultyRegex = new RegExp(`^${testId}$`, 'i');
      const facultyUser = await User.findOne({
        studentID: facultyRegex
      });
      
      if (facultyUser) {
        console.log(`✅ Found faculty: ${facultyUser.name} (${facultyUser.studentID})`);
      } else {
        console.log(`❌ No faculty found for ID: ${testId}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

testFacultyLogin();