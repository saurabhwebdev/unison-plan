import { sendEmail } from "./email";
import User from "@/models/User";

interface EmailNotificationParams {
  userId: string;
  notificationType:
    | "projectCreated"
    | "projectAssigned"
    | "projectStatusChanged"
    | "projectDeadlineApproaching"
    | "projectCompleted"
    | "taskAssigned"
    | "taskDueSoon"
    | "taskOverdue"
    | "taskCompleted"
    | "taskStatusChanged"
    | "taskMentioned"
    | "clientAssigned"
    | "clientStatusChanged"
    | "budgetAlert"
    | "teamMemberAdded";
  emailTemplate: {
    subject: string;
    html: string;
    text: string;
  };
}

/**
 * Sends an email notification to a user if they have enabled that notification type
 */
export async function sendNotificationEmail({
  userId,
  notificationType,
  emailTemplate,
}: EmailNotificationParams) {
  try {
    // Fetch user with email preferences
    const user = await User.findById(userId).select("email emailPreferences");

    if (!user) {
      console.error(`User not found: ${userId}`);
      return { success: false, error: "User not found" };
    }

    // Check if email notifications are enabled globally
    if (!user.emailPreferences?.enabled) {
      console.log(`Email notifications disabled for user: ${user.email}`);
      return { success: true, skipped: true, reason: "Notifications disabled" };
    }

    // Check if this specific notification type is enabled
    if (!user.emailPreferences[notificationType]) {
      console.log(
        `Notification type ${notificationType} disabled for user: ${user.email}`
      );
      return {
        success: true,
        skipped: true,
        reason: `${notificationType} disabled`,
      };
    }

    // Send the email
    const result = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    return result;
  } catch (error) {
    console.error("Error sending notification email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Sends notification emails to multiple users
 */
export async function sendNotificationEmailToMultiple({
  userIds,
  notificationType,
  emailTemplate,
}: {
  userIds: string[];
  notificationType: EmailNotificationParams["notificationType"];
  emailTemplate: EmailNotificationParams["emailTemplate"];
}) {
  const results = await Promise.allSettled(
    userIds.map((userId) =>
      sendNotificationEmail({
        userId,
        notificationType,
        emailTemplate,
      })
    )
  );

  const successful = results.filter(
    (r) => r.status === "fulfilled" && r.value.success
  ).length;
  const skipped = results.filter(
    (r) =>
      r.status === "fulfilled" && r.value.success && r.value.skipped
  ).length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return {
    total: userIds.length,
    successful,
    skipped,
    failed,
  };
}

/**
 * Sends an email to a user regardless of their notification preferences
 * Use this for critical emails like password resets, OTPs, etc.
 */
export async function sendCriticalEmail({
  userId,
  emailTemplate,
}: {
  userId: string;
  emailTemplate: {
    subject: string;
    html: string;
    text: string;
  };
}) {
  try {
    const user = await User.findById(userId).select("email");

    if (!user) {
      console.error(`User not found: ${userId}`);
      return { success: false, error: "User not found" };
    }

    const result = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    return result;
  } catch (error) {
    console.error("Error sending critical email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Sends an email to an email address (not a user ID)
 * Use this for emails to non-users or when you already have the email address
 */
export async function sendEmailToAddress({
  email,
  emailTemplate,
}: {
  email: string;
  emailTemplate: {
    subject: string;
    html: string;
    text: string;
  };
}) {
  try {
    const result = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    });

    return result;
  } catch (error) {
    console.error("Error sending email to address:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Gets users who should receive a specific notification type
 * Filters out users who have disabled that notification
 */
export async function getUsersForNotification({
  userIds,
  notificationType,
}: {
  userIds: string[];
  notificationType: EmailNotificationParams["notificationType"];
}) {
  try {
    const users = await User.find({
      _id: { $in: userIds },
      "emailPreferences.enabled": true,
      [`emailPreferences.${notificationType}`]: true,
    }).select("_id email username");

    return users;
  } catch (error) {
    console.error("Error getting users for notification:", error);
    return [];
  }
}

/**
 * Batches emails for digest notifications
 * Groups multiple notifications into a single email based on user preference
 */
export async function batchNotificationsForDigest({
  userId,
  notifications,
}: {
  userId: string;
  notifications: Array<{
    type: string;
    title: string;
    description: string;
    url?: string;
    timestamp: Date;
  }>;
}) {
  try {
    const user = await User.findById(userId).select("email emailPreferences username");

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if user wants instant notifications or digest
    if (user.emailPreferences?.frequency === "instant") {
      return { success: true, skipped: true, reason: "User prefers instant notifications" };
    }

    // Group notifications by type
    const groupedNotifications = notifications.reduce((acc, notif) => {
      if (!acc[notif.type]) {
        acc[notif.type] = [];
      }
      acc[notif.type].push(notif);
      return acc;
    }, {} as Record<string, typeof notifications>);

    // Build digest email
    const digestHtml = buildDigestEmail(user.username, groupedNotifications, user.emailPreferences?.frequency);

    const subject = `Your ${user.emailPreferences?.frequency === "daily_digest" ? "Daily" : "Weekly"} Digest - Unison Plan`;

    const result = await sendEmail({
      to: user.email,
      subject,
      html: digestHtml,
      text: buildDigestTextEmail(user.username, notifications),
    });

    return result;
  } catch (error) {
    console.error("Error sending digest email:", error);
    return { success: false, error: "Failed to send digest" };
  }
}

function buildDigestEmail(
  userName: string,
  groupedNotifications: Record<string, Array<{
    type: string;
    title: string;
    description: string;
    url?: string;
    timestamp: Date;
  }>>,
  frequency?: string
) {
  const notificationTypes = Object.keys(groupedNotifications);

  let notificationSections = "";
  for (const type of notificationTypes) {
    const items = groupedNotifications[type];
    notificationSections += `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #667eea; font-size: 18px; margin-bottom: 15px; text-transform: capitalize;">
          ${type.replace(/([A-Z])/g, " $1").trim()} (${items.length})
        </h3>
        ${items.map(item => `
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #667eea;">
            <p style="margin: 0 0 5px 0; font-weight: bold;">${item.title}</p>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${item.description}</p>
            <p style="margin: 0; color: #999; font-size: 12px;">
              ${new Date(item.timestamp).toLocaleDateString()} at ${new Date(item.timestamp).toLocaleTimeString()}
            </p>
            ${item.url ? `<a href="${item.url}" style="color: #667eea; font-size: 14px; text-decoration: none;">View Details →</a>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${frequency === "daily_digest" ? "Daily" : "Weekly"} Digest</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Your ${frequency === "daily_digest" ? "Daily" : "Weekly"} Digest</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Here's a summary of your notifications from ${frequency === "daily_digest" ? "today" : "this week"}:
    </p>

    ${notificationSections}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      You're receiving this digest because your email preferences are set to "${frequency}".
      You can change this in your account settings.
    </p>

    <p style="font-size: 14px; color: #666; margin-top: 10px;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;
}

function buildDigestTextEmail(
  userName: string,
  notifications: Array<{
    type: string;
    title: string;
    description: string;
    url?: string;
    timestamp: Date;
  }>
) {
  let text = `Your Digest - Unison Plan\n\nHi ${userName},\n\nHere's a summary of your recent notifications:\n\n`;

  notifications.forEach((notif, index) => {
    text += `${index + 1}. ${notif.title}\n`;
    text += `   ${notif.description}\n`;
    text += `   ${new Date(notif.timestamp).toLocaleString()}\n`;
    if (notif.url) {
      text += `   ${notif.url}\n`;
    }
    text += `\n`;
  });

  text += `\nThis is an automated notification from Unison Plan.`;

  return text;
}
