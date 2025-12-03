import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { generateResetToken, getResetTokenExpiry } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { passwordResetEmailTemplate } from "@/lib/emailTemplates";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json(
        {
          success: true,
          message: "If the email exists, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = getResetTokenExpiry();

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    const emailTemplate = passwordResetEmailTemplate(user.username, resetToken);
    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    return NextResponse.json(
      {
        success: true,
        message: "If the email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
