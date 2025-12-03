/**
 * Ensure all users have email preferences
 * Run this script after deploying the email notification feature
 * Usage: node scripts/ensure-email-preferences.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/unison-plan';

const defaultEmailPreferences = {
  enabled: true,
  frequency: 'instant',
  projectCreated: true,
  projectAssigned: true,
  projectStatusChanged: true,
  projectDeadlineApproaching: true,
  projectCompleted: true,
  taskAssigned: true,
  taskDueSoon: true,
  taskOverdue: true,
  taskCompleted: false,
  taskStatusChanged: false,
  taskMentioned: true,
  clientAssigned: true,
  clientStatusChanged: false,
  budgetAlert: true,
  teamMemberAdded: true,
  weeklyDigest: false,
  monthlyReport: false,
};

async function ensureEmailPreferences() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.connection.collection('users');

    // Count total users
    const totalUsers = await User.countDocuments({});
    console.log(`📊 Total users in database: ${totalUsers}`);

    // Count users without email preferences
    const usersWithoutPrefs = await User.countDocuments({
      emailPreferences: { $exists: false }
    });
    console.log(`📧 Users without email preferences: ${usersWithoutPrefs}`);

    if (usersWithoutPrefs === 0) {
      console.log('\n✅ All users already have email preferences!');
      await mongoose.connection.close();
      return;
    }

    console.log(`\n🔄 Updating ${usersWithoutPrefs} users with default email preferences...`);

    // Update users with default email preferences
    const result = await User.updateMany(
      { emailPreferences: { $exists: false } },
      { $set: { emailPreferences: defaultEmailPreferences } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users successfully`);

    // Verify the update
    const remainingWithoutPrefs = await User.countDocuments({
      emailPreferences: { $exists: false }
    });

    if (remainingWithoutPrefs === 0) {
      console.log('✅ Migration completed successfully! All users now have email preferences.\n');
    } else {
      console.log(`⚠️  Warning: ${remainingWithoutPrefs} users still without email preferences\n`);
    }

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the script
ensureEmailPreferences();
