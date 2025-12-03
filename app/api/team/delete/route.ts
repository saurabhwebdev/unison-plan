import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authMiddleware } from "@/lib/middleware";

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication - only admin and manager can delete team members
    const authResult = await authMiddleware(request, ["admin", "manager"]);

    if (!authResult.success || !authResult.user) {
      return authResult.response || NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user to delete
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (userToDelete._id.toString() === authResult.user.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Only admin can delete other admins
    if (userToDelete.role === "admin" && authResult.user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can delete admin users" },
        { status: 403 }
      );
    }

    // Prevent deleting the last admin
    if (userToDelete.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin user" },
          { status: 400 }
        );
      }
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      {
        success: true,
        message: "Team member deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete team member error:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
