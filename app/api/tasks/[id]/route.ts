import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { requireAuth } from "@/lib/middleware";
import { sendNotificationEmail } from "@/lib/emailService";
import {
  taskStatusChangedTemplate,
  taskCompletedTemplate,
  taskBlockedTemplate,
  taskPriorityChangedTemplate,
  taskProgressUpdatedTemplate,
  taskDueDateChangedTemplate
} from "@/lib/emailTemplates/taskEmails";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const { id } = await params;
    const task = await Task.findById(id)
      .populate("project", "name projectCode")
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email")
      .populate("parentTask", "title taskNumber")
      .populate("dependencies", "title taskNumber");

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: task }, { status: 200 });
  } catch (error: any) {
    console.error("Get task error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
      estimatedHours,
      actualHours,
      progressPercentage,
      tags,
      dependencies,
    } = body;

    // Get old task for comparison
    const oldTask = await Task.findById(id)
      .populate("project", "name projectCode")
      .populate("assignedTo", "username email");

    if (!oldTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;
    if (dueDate !== undefined) updateData.dueDate = dueDate || null;
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours;
    if (actualHours !== undefined) updateData.actualHours = actualHours;
    if (progressPercentage !== undefined) updateData.progressPercentage = progressPercentage;
    if (tags !== undefined) updateData.tags = tags;
    if (dependencies !== undefined) updateData.dependencies = dependencies;

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("project", "name projectCode")
      .populate("assignedTo", "username email")
      .populate("createdBy", "username email");

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Send email notifications asynchronously
    setImmediate(async () => {
      try {
        const taskUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tasks`;

        // Notify on status change
        if (status !== undefined && status !== oldTask.status && oldTask.assignedTo) {
          const emailTemplate = taskStatusChangedTemplate({
            taskTitle: updatedTask.title,
            projectName: updatedTask.project.name,
            projectCode: updatedTask.project.projectCode,
            oldStatus: oldTask.status,
            newStatus: status,
            userName: oldTask.assignedTo.username,
            taskUrl
          });

          await sendNotificationEmail({
            userId: oldTask.assignedTo._id.toString(),
            notificationType: 'taskStatusChanged',
            emailTemplate
          });

          // Check if completed
          if (status === 'completed') {
            const completedTemplate = taskCompletedTemplate({
              taskTitle: updatedTask.title,
              projectName: updatedTask.project.name,
              projectCode: updatedTask.project.projectCode,
              userName: oldTask.assignedTo.username,
              taskUrl
            });

            await sendNotificationEmail({
              userId: oldTask.assignedTo._id.toString(),
              notificationType: 'taskCompleted',
              emailTemplate: completedTemplate
            });
          }

          // Check if blocked
          if (status === 'blocked') {
            const blockedTemplate = taskBlockedTemplate({
              taskTitle: updatedTask.title,
              projectName: updatedTask.project.name,
              projectCode: updatedTask.project.projectCode,
              blockReason: body.blockReason,
              userName: oldTask.assignedTo.username,
              taskUrl
            });

            await sendNotificationEmail({
              userId: oldTask.assignedTo._id.toString(),
              notificationType: 'taskStatusChanged',
              emailTemplate: blockedTemplate
            });
          }
        }

        // Notify on priority change
        if (priority !== undefined && priority !== oldTask.priority && oldTask.assignedTo) {
          const emailTemplate = taskPriorityChangedTemplate({
            taskTitle: updatedTask.title,
            projectName: updatedTask.project.name,
            projectCode: updatedTask.project.projectCode,
            priority,
            userName: oldTask.assignedTo.username,
            taskUrl
          });

          await sendNotificationEmail({
            userId: oldTask.assignedTo._id.toString(),
            notificationType: 'taskStatusChanged',
            emailTemplate
          });
        }

        // Notify on progress update (only if significant change, e.g., 25% or more)
        if (progressPercentage !== undefined && oldTask.assignedTo) {
          const progressDiff = Math.abs(progressPercentage - (oldTask.progressPercentage || 0));
          if (progressDiff >= 25) {
            const emailTemplate = taskProgressUpdatedTemplate({
              taskTitle: updatedTask.title,
              projectName: updatedTask.project.name,
              projectCode: updatedTask.project.projectCode,
              progressPercentage,
              userName: oldTask.assignedTo.username,
              taskUrl
            });

            await sendNotificationEmail({
              userId: oldTask.assignedTo._id.toString(),
              notificationType: 'taskStatusChanged',
              emailTemplate
            });
          }
        }

        // Notify on due date change
        if (dueDate !== undefined && dueDate !== oldTask.dueDate && oldTask.assignedTo) {
          const emailTemplate = taskDueDateChangedTemplate({
            taskTitle: updatedTask.title,
            projectName: updatedTask.project.name,
            projectCode: updatedTask.project.projectCode,
            dueDate: new Date(dueDate).toLocaleDateString(),
            userName: oldTask.assignedTo.username,
            taskUrl
          });

          await sendNotificationEmail({
            userId: oldTask.assignedTo._id.toString(),
            notificationType: 'taskDueSoon',
            emailTemplate
          });
        }
      } catch (emailError) {
        console.error('Error sending task update emails:', emailError);
      }
    });

    return NextResponse.json(
      { success: true, data: updatedTask },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const { id } = await params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}
