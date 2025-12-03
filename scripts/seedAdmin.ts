// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// Now import other modules after env vars are loaded
import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import User from "../models/User";
import { hashPassword } from "../lib/auth";

async function seedAdmin() {
  try {
    console.log("🌱 Starting admin user seed...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to database");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("ℹ️  Admin user already exists");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword("admin");

    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true, // Admin is auto-verified
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin");
    console.log("   Email: admin@example.com");
    console.log("   Role: admin");
    console.log("\n⚠️  IMPORTANT: Please change the admin password after first login!\n");

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
