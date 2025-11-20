require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

const listUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!\n');

    const users = await User.find().select('-password').sort({ studentID: 1 });
    
    if (users.length === 0) {
      console.log('📭 No users found in database.');
      console.log('💡 Run "npm run seed" to register members.\n');
      return;
    }

    console.log('=' .repeat(80));
    console.log('📊 REGISTERED USERS SUMMARY');
    console.log('='.repeat(80));
    
    const admins = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role === 'user');
    
    console.log(`Total Users: ${users.length}`);
    console.log(`Admins: ${admins.length}`);
    console.log(`Regular Users: ${regularUsers.length}`);
    console.log('='.repeat(80));
    
    console.log('\n👑 ADMIN USERS (Committee Members):');
    console.log('-'.repeat(80));
    if (admins.length === 0) {
      console.log('   No admins found.');
    } else {
      admins.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 ${user.email}`);
        console.log(`   🆔 ${user.studentID}`);
        console.log(`   📅 Created: ${user.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }
    
    console.log('👤 REGULAR USERS:');
    console.log('-'.repeat(80));
    if (regularUsers.length === 0) {
      console.log('   No regular users found.');
    } else {
      regularUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.studentID}) - ${user.email}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ List completed!');
    console.log('='.repeat(80) + '\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

listUsers();
