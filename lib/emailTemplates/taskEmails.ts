interface TaskEmailParams {
  taskTitle: string;
  taskDescription?: string;
  projectName: string;
  projectCode: string;
  userName: string;
  userEmail: string;
  assignedBy?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  daysUntilDue?: number;
  daysOverdue?: number;
  progressPercentage?: number;
  mentionedBy?: string;
  comment?: string;
  oldStatus?: string;
  newStatus?: string;
  blockReason?: string;
  taskUrl?: string;
}

export function taskAssignedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, assignedBy, dueDate, priority, userName, taskUrl } = params;

  const subject = `New Task Assigned: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">New Task Assigned</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">You have been assigned a new task:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      ${assignedBy ? `<p style="margin: 8px 0;"><strong>Assigned By:</strong> ${assignedBy}</p>` : ''}
      ${priority ? `<p style="margin: 8px 0;"><strong>Priority:</strong> <span style="text-transform: uppercase;">${priority}</span></p>` : ''}
      ${dueDate ? `<p style="margin: 8px 0;"><strong>Due Date:</strong> ${dueDate}</p>` : ''}
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
New Task Assigned: ${taskTitle}

Hi ${userName},

You have been assigned a new task:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
${assignedBy ? `Assigned By: ${assignedBy}` : ''}
${priority ? `Priority: ${priority.toUpperCase()}` : ''}
${dueDate ? `Due Date: ${dueDate}` : ''}

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskDueSoonTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, dueDate, daysUntilDue, userName, taskUrl } = params;

  const subject = `⏰ Task Due Soon: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Task Due Soon</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A task assigned to you is due soon:</p>

    <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
      <h2 style="color: #f59e0b; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      <p style="margin: 8px 0;"><strong>Due Date:</strong> ${dueDate}</p>
      <p style="margin: 8px 0; font-size: 18px; color: #d97706;"><strong>Days Remaining: ${daysUntilDue}</strong></p>
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
⏰ Task Due Soon: ${taskTitle}

Hi ${userName},

A task assigned to you is due soon:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
Due Date: ${dueDate}
Days Remaining: ${daysUntilDue}

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskOverdueTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, dueDate, daysOverdue, userName, taskUrl } = params;

  const subject = `🚨 Task Overdue: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Task Overdue</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A task assigned to you is overdue:</p>

    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 20px;">
      <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      <p style="margin: 8px 0;"><strong>Due Date:</strong> ${dueDate}</p>
      <p style="margin: 8px 0; font-size: 18px; color: #dc2626;"><strong>Days Overdue: ${daysOverdue}</strong></p>
    </div>

    <p style="font-size: 14px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 6px; margin: 20px 0;">
      ⚠️ This task requires immediate attention.
    </p>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
🚨 Task Overdue: ${taskTitle}

Hi ${userName},

A task assigned to you is overdue:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
Due Date: ${dueDate}
Days Overdue: ${daysOverdue}

⚠️ This task requires immediate attention.

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskCompletedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, userName, taskUrl } = params;

  const subject = `✅ Task Completed: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Task Completed</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A task has been marked as completed:</p>

    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
      <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      <p style="margin: 8px 0; color: #059669;">🎉 Status: Completed</p>
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
✅ Task Completed: ${taskTitle}

Hi ${userName},

A task has been marked as completed:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
Status: Completed

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskStatusChangedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, oldStatus, newStatus, userName, taskUrl } = params;

  const subject = `Task Status Updated: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Status Update</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">The status of a task has been updated:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      <div style="display: flex; align-items: center; margin: 15px 0;">
        <span style="background: #f3f4f6; padding: 8px 16px; border-radius: 6px; margin-right: 10px;">${oldStatus || 'N/A'}</span>
        <span style="font-size: 20px;">→</span>
        <span style="background: #667eea; color: white; padding: 8px 16px; border-radius: 6px; margin-left: 10px;">${newStatus}</span>
      </div>
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
Task Status Updated: ${taskTitle}

Hi ${userName},

The status of a task has been updated:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
Previous Status: ${oldStatus || 'N/A'}
New Status: ${newStatus}

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskMentionedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, mentionedBy, comment, userName, taskUrl } = params;

  const subject = `You were mentioned in: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">You Were Mentioned</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">${mentionedBy} mentioned you in a task:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      ${comment ? `
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
        <p style="margin: 0; font-style: italic; color: #555;">"${comment}"</p>
      </div>
      ` : ''}
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
You were mentioned in: ${taskTitle}

Hi ${userName},

${mentionedBy} mentioned you in a task:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
${comment ? `Comment: "${comment}"` : ''}

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskBlockedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, blockReason, userName, taskUrl } = params;

  const subject = `🚧 Task Blocked: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🚧 Task Blocked</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A task has been marked as blocked:</p>

    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 20px;">
      <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      ${blockReason ? `
      <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
        <p style="margin: 0;"><strong>Block Reason:</strong> ${blockReason}</p>
      </div>
      ` : ''}
    </div>

    <p style="font-size: 14px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 6px; margin: 20px 0;">
      ⚠️ This task requires attention to resolve the blocker.
    </p>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
🚧 Task Blocked: ${taskTitle}

Hi ${userName},

A task has been marked as blocked:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
${blockReason ? `Block Reason: ${blockReason}` : ''}

⚠️ This task requires attention to resolve the blocker.

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskPriorityChangedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, priority, userName, taskUrl } = params;

  const subject = `Task Priority Changed: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Priority Update</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">The priority of a task has been changed:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      <p style="margin: 8px 0;"><strong>New Priority:</strong> <span style="text-transform: uppercase; font-weight: bold;">${priority}</span></p>
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
Task Priority Changed: ${taskTitle}

Hi ${userName},

The priority of a task has been changed:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
New Priority: ${priority?.toUpperCase()}

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskProgressUpdatedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, progressPercentage, userName, taskUrl } = params;

  const subject = `Task Progress Updated: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Progress Update</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">Progress has been updated on a task:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
      <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      <div style="margin: 15px 0;">
        <p style="margin: 8px 0;"><strong>Progress:</strong> ${progressPercentage}%</p>
        <div style="background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); height: 100%; width: ${progressPercentage}%; transition: width 0.3s ease;"></div>
        </div>
      </div>
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
Task Progress Updated: ${taskTitle}

Hi ${userName},

Progress has been updated on a task:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
Progress: ${progressPercentage}%

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskCommentAddedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, mentionedBy, comment, userName, taskUrl } = params;

  const subject = `New Comment on: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">New Comment</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">${mentionedBy} added a comment on a task:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      ${comment ? `
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
        <p style="margin: 0; font-style: italic; color: #555;">"${comment}"</p>
      </div>
      ` : ''}
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
New Comment on: ${taskTitle}

Hi ${userName},

${mentionedBy} added a comment on a task:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
${comment ? `Comment: "${comment}"` : ''}

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function taskDueDateChangedTemplate(params: TaskEmailParams) {
  const { taskTitle, projectName, projectCode, dueDate, userName, taskUrl } = params;

  const subject = `Task Due Date Changed: ${taskTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Due Date Changed</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">The due date of a task has been changed:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${taskTitle}</h2>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      <p style="margin: 8px 0;"><strong>New Due Date:</strong> ${dueDate}</p>
    </div>

    ${taskUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${taskUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Task</a>
    </div>
    ` : ''}

    <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      This is an automated notification from Unison Plan.
    </p>
  </div>
</body>
</html>
  `;

  const text = `
Task Due Date Changed: ${taskTitle}

Hi ${userName},

The due date of a task has been changed:

Task: ${taskTitle}
Project: ${projectName} (${projectCode})
New Due Date: ${dueDate}

${taskUrl ? `View Task: ${taskUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}
