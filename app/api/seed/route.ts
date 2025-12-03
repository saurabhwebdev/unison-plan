import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: true,
          message: "Admin user already exists",
          admin: {
            username: existingAdmin.username,
            email: existingAdmin.email,
            role: existingAdmin.role,
          },
        },
        { status: 200 }
      );
    }

    // Create admin user
    const hashedPassword = await hashPassword("admin");

    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true, // Admin is auto-verified
      isFirstLogin: false, // Admin doesn't need to change password
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin user created successfully!",
        admin: {
          username: "admin",
          password: "admin",
          email: "admin@example.com",
          role: "admin",
        },
        warning: "IMPORTANT: Please change the admin password after first login!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding admin user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed admin user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
