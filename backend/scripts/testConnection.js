require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('🔌 Testing MongoDB connection...\n');
  
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file');
      console.log('\n📝 Please create a .env file with:');
      console.log('MONGODB_URI=your_mongodb_connection_string');
      process.exit(1);
    }

    console.log('📍 Connecting to:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//*****:*****@'));
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Existing collections:');
    if (collections.length === 0) {
      console.log('   (No collections yet - this is normal for a new database)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    console.log('\n✨ Connection test successful!');
    console.log('👍 You can now run: npm run seed');
    
    await mongoose.connection.close();
    console.log('\n👋 Connection closed.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify MONGODB_URI in .env file');
    console.log('3. Check network connectivity');
    console.log('4. Ensure database user has proper permissions');
    
    process.exit(1);
  }
};

testConnection();
