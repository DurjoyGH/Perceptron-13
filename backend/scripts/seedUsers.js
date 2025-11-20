require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// All members data
const allMembers = [
  { id: "200102", name: "MD. RAFID AHMMED", gender: "male" },
  { id: "200104", name: "NAZMUS SAKIB SIBLY", gender: "male" },
  { id: "200105", name: "ABRAR HOSSAIN", gender: "male" },
  { id: "200107", name: "ABDULLAH AL NOMAN", gender: "male" },
  { id: "200110", name: "TAPU GHOSH", gender: "male" },
  { id: "200111", name: "TAHMID MUNTASER KAIF", gender: "male" },
  { id: "200114", name: "RAMJAN ALI KHA", gender: "male" },
  { id: "200117", name: "A. K. M. S. LIMON", gender: "male" },
  { id: "200118", name: "MOHAMMAD AZAZUL ISLAM", gender: "male" },
  { id: "200120", name: "DURJOY GHOSH", gender: "male" },
  { id: "200121", name: "MD. MUSHFIQUR RAHMAN", gender: "male" },
  { id: "200122", name: "FAHIM AHMED", gender: "male" },
  { id: "200124", name: "S. AHMAD MUSA REZOWAN", gender: "male" },
  { id: "200126", name: "JOY KUMAR ACHARJEE", gender: "male" },
  { id: "200132", name: "MD. SADIK MAHMUD RAIHAN", gender: "male" },
  { id: "200133", name: "IBNUS NAHIYAN SAMIT", gender: "male" },
  { id: "200135", name: "ANIKA TABASSUM", gender: "female" },
  { id: "200137", name: "RISAN MAHFUZ", gender: "male" },
  { id: "200140", name: "MD. ARAFATUZZAMAN", gender: "male" },
  { id: "200142", name: "TANVIR MAHTAB TAFHIM", gender: "male" },
  { id: "200145", name: "PUSPITA SARKER", gender: "female" },
  { id: "200146", name: "BISWAJIT DEB", gender: "male" },
  { id: "200149", name: "ARIFUL ISLAM", gender: "male" },
  { id: "200150", name: "MUNNI KHANOM", gender: "female" },
  { id: "200151", name: "MD. ABU SAYED", gender: "male" },
  { id: "200152", name: "SAJID HASAN TAKBIR", gender: "male" },
  { id: "200153", name: "ANAMIKA MARMA", gender: "female" },
  { id: "200154", name: "OVESHEK KUNDU TOTON", gender: "male" }
];

// Committee members (will be made admin)
const committeeStudentIds = [
  "200107", // ABDULLAH AL NOMAN
  "200118", // MOHAMMAD AZAZUL ISLAM
  "200120", // DURJOY GHOSH
  "200132", // MD. SADIK MAHMUD RAIHAN
  "200140", // MD. ARAFATUZZAMAN
  "200152"  // SAJID HASAN TAKBIR
];

// Default password for all users (can be changed later)
const DEFAULT_PASSWORD = "Perceptron@2025";

const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seeding process...\n');

    // Check if users already exist
    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount > 0) {
      console.log(`⚠️  Warning: ${existingUsersCount} users already exist in the database.`);
      console.log('This will skip existing users and add new ones.\n');
    }

    // Hash the default password once
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

    let addedCount = 0;
    let skippedCount = 0;
    let adminCount = 0;
    let userCount = 0;

    // Process each member
    for (const member of allMembers) {
      const email = `${member.id}.cse@student.just.edu.bd`;
      const studentID = member.id;
      const isCommitteeMember = committeeStudentIds.includes(member.id);
      const role = isCommitteeMember ? 'admin' : 'user';

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { studentID }] 
      });

      if (existingUser) {
        console.log(`⏭️  Skipped: ${member.name} (${email}) - Already exists`);
        skippedCount++;
        continue;
      }

      // Create new user
      const user = await User.create({
        name: member.name,
        email: email,
        studentID: studentID,
        password: hashedPassword,
        role: role
      });

      if (isCommitteeMember) {
        console.log(`✅ Added ADMIN: ${member.name} (${email})`);
        adminCount++;
      } else {
        console.log(`✅ Added USER: ${member.name} (${email})`);
        userCount++;
      }
      
      addedCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SEEDING SUMMARY:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully added: ${addedCount} users`);
    console.log(`   👑 Admins (Committee): ${adminCount}`);
    console.log(`   👤 Regular Users: ${userCount}`);
    console.log(`⏭️  Skipped (already exist): ${skippedCount}`);
    console.log(`📧 Total members: ${allMembers.length}`);
    console.log('='.repeat(60));
    
    console.log('\n🔑 DEFAULT CREDENTIALS:');
    console.log('='.repeat(60));
    console.log(`Email Format: [studentID].cse@student.just.edu.bd`);
    console.log(`Password (all users): ${DEFAULT_PASSWORD}`);
    console.log('='.repeat(60));
    
    console.log('\n👑 COMMITTEE MEMBERS (ADMINS):');
    console.log('='.repeat(60));
    committeeStudentIds.forEach(id => {
      const member = allMembers.find(m => m.id === id);
      if (member) {
        console.log(`${member.name} - ${id}.cse@student.just.edu.bd`);
      }
    });
    console.log('='.repeat(60));

    console.log('\n✨ Seeding completed successfully!');
    console.log('⚠️  IMPORTANT: Please ask users to change their passwords after first login.\n');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

// Run the seed script
const runSeed = async () => {
  try {
    await connectDB();
    await seedUsers();
    console.log('✅ All done! Closing database connection...');
    await mongoose.connection.close();
    console.log('👋 Database connection closed. Goodbye!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedUsers };
