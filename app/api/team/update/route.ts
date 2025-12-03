import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authMiddleware } from "@/lib/middleware";

export async function PUT(request: NextRequest) {
  try {
    // Check authentication - only admin and manager can update team members
    const authResult = await authMiddleware(request, ["admin", "manager"]);

    if (!authResult.success || !authResult.user) {
      return authResult.response || NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { userId, username, email, role } = await request.json();

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user to update
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Only admin can change roles to/from admin
    if ((role === "admin" || userToUpdate.role === "admin") && authResult.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can manage admin roles" },
        { status: 403 }
      );
    }

    // Prevent changing the last admin's role
    if (userToUpdate.role === "admin" && role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot change the role of the last admin" },
          { status: 400 }
        );
      }
    }

    // Check if username or email already exists (excluding current user)
    if (username && username !== userToUpdate.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
    }

    if (email && email !== userToUpdate.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Update user fields
    if (username) userToUpdate.username = username;
    if (email) userToUpdate.email = email;
    if (role) userToUpdate.role = role;

    await userToUpdate.save();

    return NextResponse.json(
      {
        success: true,
        message: "Team member updated successfully",
        user: {
          _id: userToUpdate._id,
          username: userToUpdate.username,
          email: userToUpdate.email,
          role: userToUpdate.role,
          isVerified: userToUpdate.isVerified,
          invitedBy: userToUpdate.invitedBy,
          createdAt: userToUpdate.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}
