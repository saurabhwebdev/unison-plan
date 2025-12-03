export const otpEmailTemplate = (username: string, otp: string) => {
  return {
    subject: "Verify Your Account - OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .otp-box { background-color: #fff; border: 2px dashed #4F46E5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <h2>Hello ${username},</h2>
              <p>Thank you for signing up with Project Tracker!</p>
              <p>To complete your registration, please use the following One-Time Password (OTP):</p>
              <div class="otp-box">${otp}</div>
              <p>This OTP will expire in <strong>10 minutes</strong>.</p>
              <p>If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${username},\n\nThank you for signing up with Project Tracker!\n\nYour OTP code is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this verification, please ignore this email.`,
  };
};

export const loginEmailTemplate = (username: string, ipAddress: string = "Unknown", userAgent: string = "Unknown") => {
  const timestamp = new Date().toLocaleString();
  return {
    subject: "New Login to Your Account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .info-box { background-color: #fff; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { color: #EF4444; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Login Notification</h1>
            </div>
            <div class="content">
              <h2>Hello ${username},</h2>
              <p>We detected a new login to your account.</p>
              <div class="info-box">
                <p><strong>Time:</strong> ${timestamp}</p>
                <p><strong>IP Address:</strong> ${ipAddress}</p>
                <p><strong>Device:</strong> ${userAgent}</p>
              </div>
              <p>If this was you, you can safely ignore this email.</p>
              <p class="warning">If you didn't log in, please secure your account immediately by resetting your password.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${username},\n\nWe detected a new login to your account.\n\nTime: ${timestamp}\nIP Address: ${ipAddress}\nDevice: ${userAgent}\n\nIf this was you, you can safely ignore this email.\n\nIf you didn't log in, please secure your account immediately by resetting your password.`,
  };
};

export const logoutEmailTemplate = (username: string) => {
  const timestamp = new Date().toLocaleString();
  return {
    subject: "Logout from Your Account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6B7280; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .info-box { background-color: #fff; border-left: 4px solid #6B7280; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Logout Notification</h1>
            </div>
            <div class="content">
              <h2>Hello ${username},</h2>
              <p>You have successfully logged out from your account.</p>
              <div class="info-box">
                <p><strong>Time:</strong> ${timestamp}</p>
              </div>
              <p>Thank you for using Project Tracker!</p>
              <p>If you didn't perform this action, please contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${username},\n\nYou have successfully logged out from your account.\n\nTime: ${timestamp}\n\nThank you for using Project Tracker!\n\nIf you didn't perform this action, please contact our support team immediately.`,
  };
};

export const passwordResetEmailTemplate = (username: string, resetToken: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

  return {
    subject: "Password Reset Request",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background-color: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <h2>Hello ${username},</h2>
              <p>We received a request to reset your password for your Project Tracker account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
              <div class="warning">
                <p><strong>⚠️ Important:</strong></p>
                <p>This link will expire in <strong>1 hour</strong>.</p>
                <p>If you didn't request a password reset, please ignore this email or contact support if you're concerned.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${username},\n\nWe received a request to reset your password for your Project Tracker account.\n\nPlease click the following link to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email.`,
  };
};

export const teamInviteEmailTemplate = (
  username: string,
  email: string,
  temporaryPassword: string,
  inviterName: string,
  loginUrl: string
) => {
  return {
    subject: "You've been invited to Project Tracker!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #77c044 0%, #0d6eb8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background-color: white; padding: 20px; border-left: 4px solid #77c044; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #77c044; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Project Tracker!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${username}</strong>,</p>
              <p><strong>${inviterName}</strong> has invited you to join the Project Tracker team!</p>

              <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> <code style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-size: 16px;">${temporaryPassword}</code></p>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> You will be required to change your password on first login for security purposes.
              </div>

              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to Project Tracker</a>
              </div>

              <p style="margin-top: 30px;">If you have any questions or need assistance, please don't hesitate to reach out.</p>

              <p>Best regards,<br>Project Tracker Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to Project Tracker!

Hi ${username},

${inviterName} has invited you to join the Project Tracker team!

Your Login Credentials:
Email: ${email}
Temporary Password: ${temporaryPassword}

⚠️ IMPORTANT: You will be required to change your password on first login for security purposes.

Login here: ${loginUrl}

If you have any questions or need assistance, please don't hesitate to reach out.

Best regards,
Project Tracker Team

---
This is an automated email. Please do not reply to this message.
    `,
  };
};

export const passwordResetSuccessTemplate = (username: string) => {
  const timestamp = new Date().toLocaleString();
  return {
    subject: "Password Successfully Reset",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .success-box { background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Successful</h1>
            </div>
            <div class="content">
              <h2>Hello ${username},</h2>
              <div class="success-box">
                <p>✅ Your password has been successfully reset.</p>
              </div>
              <p><strong>Time:</strong> ${timestamp}</p>
              <p>You can now log in with your new password.</p>
              <p>If you didn't perform this action, please contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Project Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hello ${username},\n\nYour password has been successfully reset.\n\nTime: ${timestamp}\n\nYou can now log in with your new password.\n\nIf you didn't perform this action, please contact our support team immediately.`,
  };
};
