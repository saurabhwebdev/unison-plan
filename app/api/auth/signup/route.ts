import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, generateOTP, getOTPExpiry } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { otpEmailTemplate } from "@/lib/emailTemplates";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 400 }
        );
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { success: false, message: "Username already taken" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = getOTPExpiry();

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      otp,
      otpExpires,
    });

    // Send OTP email
    const emailTemplate = otpEmailTemplate(username, otp);
    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! Please check your email for OTP verification.",
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
