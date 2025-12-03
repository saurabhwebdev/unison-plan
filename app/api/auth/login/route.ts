import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword, generateToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { loginEmailTemplate } from "@/lib/emailTemplates";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if verified
    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before logging in",
          needsVerification: true,
        },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if first login - redirect to change password
    if (user.isFirstLogin) {
      // Generate JWT token for authentication
      const token = await generateToken({
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      });

      const response = NextResponse.json(
        {
          success: true,
          message: "First login detected",
          requirePasswordChange: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            isFirstLogin: true,
          },
        },
        { status: 200 }
      );

      // Set cookie with token
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Get request info for email
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // Send login notification email (don't block response)
    const emailTemplate = loginEmailTemplate(user.username, ipAddress, userAgent);
    sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    }).catch((error) => {
      console.error("Failed to send login email:", error);
    });

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set cookie with token
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
