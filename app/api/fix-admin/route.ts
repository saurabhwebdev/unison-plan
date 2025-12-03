import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Find admin user and update isFirstLogin to false
    const admin = await User.findOneAndUpdate(
      { username: "admin" },
      { isFirstLogin: false },
      { new: true }
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin user updated successfully",
        admin: {
          username: admin.username,
          email: admin.email,
          isFirstLogin: admin.isFirstLogin,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fixing admin user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update admin user" },
      { status: 500 }
    );
  }
}
