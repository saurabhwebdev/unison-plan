import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { teamInviteEmailTemplate } from "@/lib/emailTemplates";
import { authMiddleware } from "@/lib/middleware";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and require admin or manager role
    const authResult = await authMiddleware(request, ["admin", "manager"]);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const { email, username, role } = await request.json();

    // Validation
    if (!email || !username || !role) {
      return NextResponse.json(
        { error: "Email, username, and role are required" },
        { status: 400 }
      );
    }

    if (!["user", "manager"].includes(role)) {
      return NextResponse.json(
        { error: "Role must be 'user' or 'manager'" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // Generate temporary password (8 characters)
    const temporaryPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await hashPassword(temporaryPassword);

    // Create new user
    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      isVerified: true, // Auto-verify invited users
      isFirstLogin: true,
      invitedBy: authResult.user.username,
    });

    // Send invitation email
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`;
    const emailTemplate = teamInviteEmailTemplate(
      username,
      email,
      temporaryPassword,
      authResult.user.username,
      loginUrl
    );

    try {
      await sendEmail({
        to: email,
        subject: "You've been invited to Project Tracker!",
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
      // Delete the created user if email fails
      await User.findByIdAndDelete(newUser._id);
      return NextResponse.json(
        { error: "Failed to send invitation email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Team member invited successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Team invite error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to invite team member" },
      { status: 500 }
    );
  }
}
