import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    // Get all users except passwords
    const users = await User.find({})
      .select("-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    console.error("Get team list error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
