import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Client from "@/models/Client";
import { verifyAuth } from "@/lib/middleware";
import mongoose from "mongoose";

// GET /api/clients/[id] - Get single client
export async function GET(
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
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    const client = await Client.findById(id)
      .populate("accountManager", "username email role")
      .populate("createdBy", "username email")
      .lean();

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: client,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client", details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(
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
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Update client fields
    Object.keys(body).forEach((key) => {
      if (key !== "_id" && key !== "createdBy" && key !== "createdAt") {
        (client as any)[key] = body[key];
      }
    });

    await client.save();

    // Populate references
    await client.populate([
      { path: "createdBy", select: "username email" },
      { path: "accountManager", select: "username email" },
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Client updated successfully",
        data: client,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating client:", error);

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
      { error: "Failed to update client", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(
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
        { error: "Invalid client ID" },
        { status: 400 }
      );
    }

    // Only admin and manager can delete clients
    const userRole = authResult.user.role;
    if (userRole !== "admin" && userRole !== "manager") {
      return NextResponse.json(
        { error: "Only admins and managers can delete clients" },
        { status: 403 }
      );
    }

    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Check if client has associated projects
    const Project = (await import("@/models/Project")).default;
    const projectCount = await Project.countDocuments({ client: id });

    if (projectCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete client with associated projects",
          details: `This client has ${projectCount} project(s). Please archive the client instead.`
        },
        { status: 400 }
      );
    }

    await Client.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Client deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client", details: error.message },
      { status: 500 }
    );
  }
}
