import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyAuth } from "@/lib/middleware";
import { sendNotificationEmail, sendNotificationEmailToMultiple } from "@/lib/emailService";
import {
  projectCreatedTemplate,
  projectAssignedTemplate,
  teamMemberAddedToProjectTemplate
} from "@/lib/emailTemplates/projectEmails";

// GET /api/projects - List all projects with filters
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    // Build filter query
    const filter: any = {};

    // Search by name or project code
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { projectCode: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by stage
    const stage = searchParams.get("stage");
    if (stage) {
      filter.stage = stage;
    }

    // Filter by status (active/archived)
    const status = searchParams.get("status");
    if (status) {
      filter.status = status;
    } else {
      // By default, only show active projects
      filter.status = "active";
    }

    // Filter by priority
    const priority = searchParams.get("priority");
    if (priority) {
      filter.priority = priority;
    }

    // Filter by team member
    const teamMember = searchParams.get("teamMember");
    if (teamMember) {
      filter["teamMembers.user"] = teamMember;
    }

    // Filter by created by
    const createdBy = searchParams.get("createdBy");
    if (createdBy) {
      filter.createdBy = createdBy;
    }

    // Filter by project manager
    const projectManager = searchParams.get("projectManager");
    if (projectManager) {
      filter.projectManager = projectManager;
    }

    // Role-based filtering
    const userRole = authResult.user.role;
    const userId = authResult.user._id || authResult.user.userId;
    if (userRole === "user") {
      // Regular users can only see projects they're part of
      filter.$or = [
        { createdBy: userId },
        { projectManager: userId },
        { "teamMembers.user": userId },
      ];
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const sort: any = { [sortBy]: sortOrder };

    // Execute query
    const projects = await Project.find(filter)
      .populate("createdBy", "username email")
      .populate("projectManager", "username email")
      .populate("businessDevelopmentLead", "username email")
      .populate("teamMembers.user", "username email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Project.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        data: projects,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.clientName || !body.clientContact) {
      return NextResponse.json(
        { error: "Missing required fields: name, clientName, clientContact" },
        { status: 400 }
      );
    }

    // Create project
    const userId = authResult.user._id || authResult.user.userId;
    const project = new Project({
      ...body,
      createdBy: userId,
      status: "active",
    });

    await project.save();

    // Populate references
    await project.populate([
      { path: "createdBy", select: "username email" },
      { path: "projectManager", select: "username email" },
      { path: "businessDevelopmentLead", select: "username email" },
      { path: "teamMembers.user", select: "username email" },
    ]);

    // Send email notifications asynchronously (don't block the response)
    setImmediate(async () => {
      try {
        const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/projects/${project._id}`;

        // Notify all team members about new project
        const teamMemberIds = body.teamMembers?.map((tm: any) => tm.user).filter(Boolean) || [];
        if (teamMemberIds.length > 0) {
          const emailTemplate = projectCreatedTemplate({
            projectName: project.name,
            projectCode: project.projectCode,
            projectDescription: project.description,
            projectManager: project.projectManager?.username,
            userName: '', // Will be replaced per user
            projectUrl
          });

          await sendNotificationEmailToMultiple({
            userIds: teamMemberIds,
            notificationType: 'projectCreated',
            emailTemplate: {
              ...emailTemplate,
              subject: emailTemplate.subject,
              html: emailTemplate.html,
              text: emailTemplate.text
            }
          });
        }

        // Notify project manager if assigned
        if (body.projectManager && body.projectManager !== userId) {
          const pmEmailTemplate = projectAssignedTemplate({
            projectName: project.name,
            projectCode: project.projectCode,
            projectManager: authResult.user.username,
            userName: project.projectManager?.username || '',
            projectUrl
          });

          await sendNotificationEmail({
            userId: body.projectManager,
            notificationType: 'projectAssigned',
            emailTemplate: pmEmailTemplate
          });
        }
      } catch (emailError) {
        console.error('Error sending project creation emails:', emailError);
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: project,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating project:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 400 }
      );
    }

    // Handle duplicate project code
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Project code already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 }
    );
  }
}
