import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Client from "@/models/Client";
import { verifyAuth } from "@/lib/middleware";
import { sendNotificationEmail } from "@/lib/emailService";
import { clientCreatedTemplate, clientAssignedTemplate } from "@/lib/emailTemplates/clientEmails";

// GET /api/clients - List all clients with filters
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

    // Search by name or company
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
        { "primaryContact.email": { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    const status = searchParams.get("status");
    if (status) {
      filter.status = status;
    } else {
      // By default, exclude archived clients
      filter.status = { $ne: "archived" };
    }

    // Filter by client type
    const clientType = searchParams.get("clientType");
    if (clientType) {
      filter.clientType = clientType;
    }

    // Filter by account manager
    const accountManager = searchParams.get("accountManager");
    if (accountManager) {
      filter.accountManager = accountManager;
    }

    // Filter by industry
    const industry = searchParams.get("industry");
    if (industry) {
      filter.industry = { $regex: industry, $options: "i" };
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
    const clients = await Client.find(filter)
      .populate("accountManager", "username email")
      .populate("createdBy", "username email")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Client.countDocuments(filter);

    return NextResponse.json(
      {
        success: true,
        data: clients,
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
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/clients - Create new client
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.primaryContact?.name || !body.primaryContact?.email) {
      return NextResponse.json(
        { error: "Missing required fields: name, primaryContact.name, primaryContact.email" },
        { status: 400 }
      );
    }

    // Create client
    const userId = authResult.user._id || authResult.user.userId;
    const client = new Client({
      ...body,
      createdBy: userId,
      status: body.status || "active",
    });

    await client.save();

    // Populate references
    await client.populate([
      { path: "createdBy", select: "username email" },
      { path: "accountManager", select: "username email" },
    ]);

    // Send email notifications asynchronously
    if (body.accountManager && body.accountManager !== userId) {
      setImmediate(async () => {
        try {
          const clientUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/clients`;

          const emailTemplate = clientAssignedTemplate({
            clientName: client.name,
            clientCompany: client.companyName,
            assignedBy: authResult.user.username,
            userName: client.accountManager?.username || '',
            clientUrl
          });

          await sendNotificationEmail({
            userId: body.accountManager,
            notificationType: 'clientAssigned',
            emailTemplate
          });
        } catch (emailError) {
          console.error('Error sending client assignment email:', emailError);
        }
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Client created successfully",
        data: client,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating client:", error);

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

    return NextResponse.json(
      { error: "Failed to create client", details: error.message },
      { status: 500 }
    );
  }
}
