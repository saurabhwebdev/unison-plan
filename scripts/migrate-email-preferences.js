const mongoose = require('mongoose');

// MongoDB connection string
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

async function migrateEmailPreferences() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.connection.collection('users');

    // Find all users without emailPreferences
    const usersWithoutPreferences = await User.find({
      emailPreferences: { $exists: false }
    }).toArray();

    console.log(`Found ${usersWithoutPreferences.length} users without email preferences`);

    if (usersWithoutPreferences.length === 0) {
      console.log('All users already have email preferences');
      await mongoose.connection.close();
      return;
    }

    // Update users with default email preferences
    const result = await User.updateMany(
      { emailPreferences: { $exists: false } },
      { $set: { emailPreferences: defaultEmailPreferences } }
    );

    console.log(`Updated ${result.modifiedCount} users with default email preferences`);

    // Verify the update
    const updatedUsers = await User.find({
      _id: { $in: usersWithoutPreferences.map(u => u._id) }
    }).toArray();

    console.log('\nSample updated user:');
    if (updatedUsers.length > 0) {
      console.log(JSON.stringify({
        username: updatedUsers[0].username,
        email: updatedUsers[0].email,
        emailPreferences: updatedUsers[0].emailPreferences
      }, null, 2));
    }

    await mongoose.connection.close();
    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateEmailPreferences();
