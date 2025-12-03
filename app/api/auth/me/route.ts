import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);

    if (!authResult.success) {
      return authResult.response;
    }

    // Connect to database
    await connectDB();

    // Get user details
    const user = await User.findById(authResult.user!.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          isFirstLogin: user.isFirstLogin,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
