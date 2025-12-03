import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyAuth } from "@/lib/middleware";

// GET /api/user/email-preferences - Get current user's email preferences
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(authResult.user._id).select("emailPreferences");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user doesn't have email preferences, return defaults
    const defaultPreferences = {
      enabled: true,
      frequency: "instant",
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

    const preferences = user.emailPreferences || defaultPreferences;

    return NextResponse.json(
      {
        success: true,
        data: preferences,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching email preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch email preferences", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/user/email-preferences - Update current user's email preferences
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    console.log("PUT /api/user/email-preferences - User ID:", authResult.user._id);
    console.log("PUT /api/user/email-preferences - Request body:", body);

    // First, get the current user to check if emailPreferences exists
    const currentUser = await User.findById(authResult.user._id).select("emailPreferences");
    console.log("Current user emailPreferences:", currentUser?.emailPreferences);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If emailPreferences doesn't exist, initialize it with defaults first
    if (!currentUser.emailPreferences) {
      const defaultPreferences = {
        enabled: true,
        frequency: "instant",
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

      await User.findByIdAndUpdate(
        authResult.user._id,
        { $set: { emailPreferences: defaultPreferences } }
      );
    }

    // Validate that we're only updating emailPreferences fields
    const validFields = [
      "enabled",
      "frequency",
      "projectCreated",
      "projectAssigned",
      "projectStatusChanged",
      "projectDeadlineApproaching",
      "projectCompleted",
      "taskAssigned",
      "taskDueSoon",
      "taskOverdue",
      "taskCompleted",
      "taskStatusChanged",
      "taskMentioned",
      "clientAssigned",
      "clientStatusChanged",
      "budgetAlert",
      "teamMemberAdded",
      "weeklyDigest",
      "monthlyReport",
    ];

    const updates: any = {};
    Object.keys(body).forEach((key) => {
      if (validFields.includes(key)) {
        updates[`emailPreferences.${key}`] = body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    console.log("Updates to apply:", updates);

    const user = await User.findByIdAndUpdate(
      authResult.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("emailPreferences");

    console.log("Updated user emailPreferences:", user?.emailPreferences);

    if (!user) {
      console.error("User not found after update");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = {
      success: true,
      message: "Email preferences updated successfully",
      data: user.emailPreferences,
    };

    console.log("Sending response:", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error updating email preferences:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update email preferences", details: error.message },
      { status: 500 }
    );
  }
}
