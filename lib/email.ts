import nodemailer from "nodemailer";

// Email configuration from environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");
const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Project Tracker";

// Validate required environment variables
if (!EMAIL_USER || !EMAIL_PASSWORD || !EMAIL_FROM) {
  console.warn(
    "Email configuration incomplete. Please set EMAIL_USER, EMAIL_PASSWORD, and EMAIL_FROM in your .env.local file"
  );
}

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
};

// Email sending interface
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Send an email using the configured Gmail account
 * @param options - Email options including recipient, subject, and content
 * @returns Promise with email send result
 */
export async function sendEmail(options: SendEmailOptions) {
  if (!EMAIL_USER || !EMAIL_PASSWORD || !EMAIL_FROM) {
    throw new Error(
      "Email configuration is incomplete. Please check your environment variables."
    );
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
    to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent successfully:", info.messageId);
  return {
    success: true,
    messageId: info.messageId,
  };
}

/**
 * Verify email configuration and connection
 * @returns Promise with verification result
 */
export async function verifyEmailConfig() {
  try {
    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      return {
        success: false,
        error: "Email credentials not configured",
      };
    }

    const transporter = createTransporter();
    await transporter.verify();

    console.log("Email configuration verified successfully");
    return {
      success: true,
      message: "Email configuration is valid",
    };
  } catch (error) {
    console.error("Email configuration verification failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
