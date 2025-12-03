import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyAuth } from "@/lib/middleware";
import mongoose from "mongoose";
import { sendNotificationEmail, sendNotificationEmailToMultiple } from "@/lib/emailService";
import {
  projectStatusChangedTemplate,
  projectDeadlineApproachingTemplate,
  projectCompletedTemplate,
  teamMemberAddedToProjectTemplate,
  teamMemberRemovedFromProjectTemplate,
  projectPriorityChangedTemplate,
  budgetThresholdReachedTemplate
} from "@/lib/emailTemplates/projectEmails";

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await Project.findById(id)
      .populate("createdBy", "username email")
      .populate("projectManager", "username email")
      .populate("businessDevelopmentLead", "username email")
      .populate("teamMembers.user", "username email role")
      .lean();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this project
    const userRole = authResult.user?.role;
    const userId = authResult.user?._id?.toString();

    // Admin and manager roles can see all projects
    if (userRole === "user" && userId) {
      // Regular users can only see projects they're part of
      const isTeamMember = project.teamMembers.some(
        (member: any) => member.user && member.user._id?.toString() === userId
      );
      const isCreator = project.createdBy && project.createdBy._id?.toString() === userId;
      const isPM =
        project.projectManager &&
        project.projectManager._id?.toString() === userId;

      if (!isTeamMember && !isCreator && !isPM) {
        return NextResponse.json(
          { error: "Access denied to this project" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const userRole = authResult.user?.role;
    const userId = authResult.user?._id?.toString();

    if (!userRole || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userRole === "user") {
      return NextResponse.json(
        { error: "You don't have permission to edit projects" },
        { status: 403 }
      );
    }

    // Managers and PMs can only edit projects they're assigned to
    if (userRole === "manager" || userRole === "user") {
      const isPM =
        project.projectManager &&
        project.projectManager.toString() === userId;
      const isCreator = project.createdBy.toString() === userId;

      if (!isPM && !isCreator) {
        return NextResponse.json(
          { error: "You can only edit projects you manage" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();

    // Track changes for email notifications
    const oldStage = project.stage;
    const oldPriority = project.priority;
    const oldBudgetSpent = project.budgetSpent;
    const oldTeamMembers = project.teamMembers.map((tm: any) => tm.user?.toString());

    // Update project fields
    Object.keys(body).forEach((key) => {
      if (key !== "_id" && key !== "createdBy" && key !== "createdAt") {
        (project as any)[key] = body[key];
      }
    });

    await project.save();

    // Populate references
    await project.populate([
      { path: "createdBy", select: "username email" },
      { path: "projectManager", select: "username email" },
      { path: "businessDevelopmentLead", select: "username email" },
      { path: "teamMembers.user", select: "username email" },
    ]);

    // Send email notifications asynchronously
    setImmediate(async () => {
      try {
        const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/projects/${project._id}`;
        const allTeamMemberIds = project.teamMembers?.map((tm: any) => tm.user?._id?.toString()).filter(Boolean) || [];

        // Notify on stage/status change
        if (body.stage && body.stage !== oldStage) {
          const emailTemplate = projectStatusChangedTemplate({
            projectName: project.name,
            projectCode: project.projectCode,
            oldStatus: oldStage,
            newStatus: body.stage,
            userName: '',
            projectUrl
          });

          // Notify all team members
          if (allTeamMemberIds.length > 0) {
            await sendNotificationEmailToMultiple({
              userIds: allTeamMemberIds,
              notificationType: 'projectStatusChanged',
              emailTemplate
            });
          }

          // Check if project completed
          if (body.stage === 'completed' || body.stage === 'delivered') {
            const completedTemplate = projectCompletedTemplate({
              projectName: project.name,
              projectCode: project.projectCode,
              userName: '',
              projectUrl
            });

            if (allTeamMemberIds.length > 0) {
              await sendNotificationEmailToMultiple({
                userIds: allTeamMemberIds,
                notificationType: 'projectCompleted',
                emailTemplate: completedTemplate
              });
            }
          }
        }

        // Notify on priority change
        if (body.priority && body.priority !== oldPriority) {
          const emailTemplate = projectPriorityChangedTemplate({
            projectName: project.name,
            projectCode: project.projectCode,
            priority: body.priority,
            userName: '',
            projectUrl
          });

          if (allTeamMemberIds.length > 0) {
            await sendNotificationEmailToMultiple({
              userIds: allTeamMemberIds,
              notificationType: 'projectStatusChanged',
              emailTemplate
            });
          }
        }

        // Notify on budget threshold
        if (body.budgetSpent !== undefined && project.budget) {
          const percentageUsed = (body.budgetSpent / project.budget) * 100;
          const oldPercentage = oldBudgetSpent ? (oldBudgetSpent / project.budget) * 100 : 0;

          // Trigger alert if crossing 80% threshold
          if (percentageUsed >= 80 && oldPercentage < 80) {
            const emailTemplate = budgetThresholdReachedTemplate({
              projectName: project.name,
              projectCode: project.projectCode,
              budget: project.budget,
              budgetSpent: body.budgetSpent,
              userName: '',
              projectUrl
            });

            if (allTeamMemberIds.length > 0) {
              await sendNotificationEmailToMultiple({
                userIds: allTeamMemberIds,
                notificationType: 'budgetAlert',
                emailTemplate
              });
            }

            // Also notify project manager
            if (project.projectManager?._id) {
              await sendNotificationEmail({
                userId: project.projectManager._id.toString(),
                notificationType: 'budgetAlert',
                emailTemplate
              });
            }
          }
        }

        // Notify on team member changes
        if (body.teamMembers) {
          const newTeamMembers = body.teamMembers.map((tm: any) => tm.user?.toString());
          const addedMembers = newTeamMembers.filter((id: string) => !oldTeamMembers.includes(id));
          const removedMembers = oldTeamMembers.filter((id: string) => !newTeamMembers.includes(id));

          // Notify added team members
          for (const memberId of addedMembers) {
            const member = project.teamMembers.find((tm: any) => tm.user?._id?.toString() === memberId);
            if (member) {
              const emailTemplate = teamMemberAddedToProjectTemplate({
                projectName: project.name,
                projectCode: project.projectCode,
                teamMemberName: member.user.username,
                userName: member.user.username,
                projectUrl
              });

              await sendNotificationEmail({
                userId: memberId,
                notificationType: 'teamMemberAdded',
                emailTemplate
              });
            }
          }

          // Notify removed team members
          for (const memberId of removedMembers) {
            const emailTemplate = teamMemberRemovedFromProjectTemplate({
              projectName: project.name,
              projectCode: project.projectCode,
              teamMemberName: '',
              userName: '',
              projectUrl
            });

            await sendNotificationEmail({
              userId: memberId,
              notificationType: 'teamMemberAdded',
              emailTemplate
            });
          }
        }
      } catch (emailError) {
        console.error('Error sending project update emails:', emailError);
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project updated successfully",
        data: project,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating project:", error);

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
      { error: "Failed to update project", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    // Only admin and manager can delete projects
    const userRole = authResult.user.role;
    if (userRole !== "admin" && userRole !== "manager") {
      return NextResponse.json(
        { error: "Only admins and managers can delete projects" },
        { status: 403 }
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project", details: error.message },
      { status: 500 }
    );
  }
}
