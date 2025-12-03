import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";
import { logoutEmailTemplate } from "@/lib/emailTemplates";

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("token")?.value;

    if (token) {
      // Verify token and get user info
      const payload = await verifyToken(token);

      if (payload) {
        // Connect to database
        await connectDB();

        // Get user details
        const user = await User.findById(payload.userId);

        if (user) {
          // Send logout notification email (don't block response)
          const emailTemplate = logoutEmailTemplate(user.username);
          sendEmail({
            to: user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
          }).catch((error) => {
            console.error("Failed to send logout email:", error);
          });
        }
      }
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
