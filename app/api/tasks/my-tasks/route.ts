import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { requireAuth } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    // Build query for tasks assigned to current user
    const query: any = { assignedTo: user._id };

    if (status && status !== "all") query.status = status;
    if (priority && priority !== "all") query.priority = priority;

    const tasks = await Task.find(query)
      .populate("project", "name projectCode")
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email")
      .sort({ dueDate: 1, createdAt: -1 }); // Sort by due date first, then creation date

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error: any) {
    console.error("Get my tasks error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
