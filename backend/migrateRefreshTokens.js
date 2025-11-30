/**
 * Migration Script: Add Refresh Token Field to Existing Users
 * 
 * This script ensures all existing users have a refreshToken field.
 * The field defaults to null, and users will get a new refresh token on their next login.
 * 
 * Run this script once after deploying the refresh token feature:
 * node migrateRefreshTokens.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const migrateUsers = async () => {
  try {
    console.log('🔄 Starting refresh token migration...');
    
    // Connect to database
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Connected to database');

    // Update all users to have refreshToken field (if they don't already)
    const result = await User.updateMany(
      { refreshToken: { $exists: false } },
      { $set: { refreshToken: null } }
    );

    console.log(`✅ Migration completed!`);
    console.log(`   - Matched: ${result.matchedCount} users`);
    console.log(`   - Modified: ${result.modifiedCount} users`);
    
    // Optional: Clear all existing refresh tokens to force re-login
    const clearTokensChoice = process.argv.includes('--clear-tokens');
    if (clearTokensChoice) {
      const clearResult = await User.updateMany(
        {},
        { $set: { refreshToken: null } }
      );
      console.log(`🔒 Cleared all refresh tokens - users will need to log in again`);
      console.log(`   - Cleared tokens for ${clearResult.modifiedCount} users`);
    } else {
      console.log(`ℹ️  To clear all existing tokens and force re-login, run:`);
      console.log(`   node migrateRefreshTokens.js --clear-tokens`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

// Run migration
migrateUsers();
