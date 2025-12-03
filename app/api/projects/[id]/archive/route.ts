import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyAuth } from "@/lib/middleware";
import mongoose from "mongoose";

// POST /api/projects/[id]/archive - Archive/Unarchive project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = params;

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

    // Check permissions - Only admin, manager, or PM can archive
    const userRole = authResult.user.role;
    const userId = authResult.user._id.toString();

    if (userRole !== "admin" && userRole !== "manager") {
      const isPM =
        project.projectManager &&
        project.projectManager.toString() === userId;
      if (!isPM) {
        return NextResponse.json(
          {
            error:
              "Only admins, managers, or project managers can archive projects",
          },
          { status: 403 }
        );
      }
    }

    // Toggle archive status
    if (project.status === "archived") {
      project.status = "active";
      project.archivedAt = undefined;
      project.archivedBy = undefined;
    } else {
      project.status = "archived";
      project.archivedAt = new Date();
      project.archivedBy = authResult.user._id;
    }

    await project.save();

    // Populate references
    await project.populate([
      { path: "createdBy", select: "username email" },
      { path: "projectManager", select: "username email" },
      { path: "archivedBy", select: "username email" },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: `Project ${
          project.status === "archived" ? "archived" : "unarchived"
        } successfully`,
        data: project,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error archiving project:", error);
    return NextResponse.json(
      { error: "Failed to archive project", details: error.message },
      { status: 500 }
    );
  }
}
