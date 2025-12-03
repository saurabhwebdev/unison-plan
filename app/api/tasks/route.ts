import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { requireAuth } from "@/lib/middleware";
import { sendNotificationEmail } from "@/lib/emailService";
import { taskAssignedTemplate } from "@/lib/emailTemplates/taskEmails";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("project");
    const assignedTo = searchParams.get("assignedTo");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    // Build query
    const query: any = {};

    if (projectId) query.project = projectId;
    if (assignedTo) query.assignedTo = assignedTo;
    if (status && status !== "all") query.status = status;
    if (priority && priority !== "all") query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { taskNumber: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query)
      .populate("project", "name projectCode")
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error: any) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success || authResult.response) {
      return authResult.response!;
    }

    const user = authResult.user!;
    await connectDB();

    const body = await request.json();
    const {
      project,
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      estimatedHours,
      tags,
      parentTask,
      dependencies,
      milestone,
    } = body;

    // Validate required fields
    if (!project || !title) {
      return NextResponse.json(
        { error: "Project and title are required" },
        { status: 400 }
      );
    }

    // Check if project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Generate task number (format: PROJECT_CODE-TASK_NUMBER)
    const projectCode = projectExists.projectCode;
    const taskCount = await Task.countDocuments({ project });
    const taskNumber = `${projectCode}-${String(taskCount + 1).padStart(3, "0")}`;

    // Ensure tags is an array
    const tagsArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);
    const dependenciesArray = Array.isArray(dependencies) ? dependencies : (dependencies ? [dependencies] : []);

    // Create task
    const task = await Task.create({
      project,
      title,
      description,
      taskNumber,
      status: status || "todo",
      priority: priority || "medium",
      assignedTo: assignedTo || null,
      createdBy: user.userId,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || null,
      tags: tagsArray,
      parentTask: parentTask || null,
      dependencies: dependenciesArray,
      milestone: milestone || null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name projectCode")
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");

    // Send email notification asynchronously
    if (assignedTo && assignedTo !== user.userId) {
      setImmediate(async () => {
        try {
          const taskUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tasks`;

          const emailTemplate = taskAssignedTemplate({
            taskTitle: title,
            projectName: projectExists.name,
            projectCode: projectExists.projectCode,
            assignedBy: user.username || 'System',
            dueDate: dueDate ? new Date(dueDate).toLocaleDateString() : undefined,
            priority,
            userName: populatedTask.assignedTo?.username || '',
            taskUrl
          });

          await sendNotificationEmail({
            userId: assignedTo,
            notificationType: 'taskAssigned',
            emailTemplate
          });
        } catch (emailError) {
          console.error('Error sending task assignment email:', emailError);
        }
      });
    }

    return NextResponse.json(
      { success: true, data: populatedTask },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create task error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}
