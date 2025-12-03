interface ProjectEmailParams {
  projectName: string;
  projectCode: string;
  projectDescription?: string;
  projectManager?: string;
  userName: string;
  userEmail: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  budget?: number;
  budgetSpent?: number;
  teamMemberName?: string;
  oldStatus?: string;
  newStatus?: string;
  daysUntilDeadline?: number;
  daysOverdue?: number;
  stage?: string;
  projectUrl?: string;
}

export function projectCreatedTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, projectDescription, projectManager, userName, projectUrl } = params;

  const subject = `New Project Created: ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">New Project Created</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A new project has been created in the system:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      ${projectDescription ? `<p style="margin: 8px 0;"><strong>Description:</strong> ${projectDescription}</p>` : ''}
      ${projectManager ? `<p style="margin: 8px 0;"><strong>Project Manager:</strong> ${projectManager}</p>` : ''}
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Project</a>
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
New Project Created: ${projectName}

Hi ${userName},

A new project has been created in the system:

Project Name: ${projectName}
Project Code: ${projectCode}
${projectDescription ? `Description: ${projectDescription}` : ''}
${projectManager ? `Project Manager: ${projectManager}` : ''}

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function projectAssignedTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, projectManager, userName, projectUrl } = params;

  const subject = `You've Been Assigned to Project: ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">Project Assignment</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">You have been assigned to a new project:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
      <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      ${projectManager ? `<p style="margin: 8px 0;"><strong>Project Manager:</strong> ${projectManager}</p>` : ''}
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Project Details</a>
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
You've Been Assigned to Project: ${projectName}

Hi ${userName},

You have been assigned to a new project:

Project Name: ${projectName}
Project Code: ${projectCode}
${projectManager ? `Project Manager: ${projectManager}` : ''}

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function projectStatusChangedTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, oldStatus, newStatus, userName, projectUrl } = params;

  const subject = `Project Status Updated: ${projectName}`;

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

    <p style="font-size: 16px; margin-bottom: 20px;">The status of project <strong>${projectName}</strong> has been updated:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName} (${projectCode})</p>
      <div style="display: flex; align-items: center; margin: 15px 0;">
        <span style="background: #f3f4f6; padding: 8px 16px; border-radius: 6px; margin-right: 10px;">${oldStatus || 'N/A'}</span>
        <span style="font-size: 20px;">→</span>
        <span style="background: #667eea; color: white; padding: 8px 16px; border-radius: 6px; margin-left: 10px;">${newStatus}</span>
      </div>
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Project</a>
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
Project Status Updated: ${projectName}

Hi ${userName},

The status of project ${projectName} has been updated:

Project: ${projectName} (${projectCode})
Previous Status: ${oldStatus || 'N/A'}
New Status: ${newStatus}

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function projectDeadlineApproachingTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, dueDate, daysUntilDeadline, userName, projectUrl } = params;

  const subject = `⚠️ Project Deadline Approaching: ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">⚠️ Deadline Approaching</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A project deadline is approaching soon:</p>

    <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
      <h2 style="color: #f59e0b; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0;"><strong>Due Date:</strong> ${dueDate}</p>
      <p style="margin: 8px 0; font-size: 18px; color: #d97706;"><strong>Days Remaining: ${daysUntilDeadline}</strong></p>
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Project</a>
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
⚠️ Project Deadline Approaching: ${projectName}

Hi ${userName},

A project deadline is approaching soon:

Project: ${projectName} (${projectCode})
Due Date: ${dueDate}
Days Remaining: ${daysUntilDeadline}

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function projectCompletedTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, userName, projectUrl } = params;

  const subject = `✅ Project Completed: ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Project Completed</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">Great news! A project has been marked as completed:</p>

    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
      <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0; color: #059669;">🎉 Status: Completed</p>
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Project</a>
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
✅ Project Completed: ${projectName}

Hi ${userName},

Great news! A project has been marked as completed:

Project: ${projectName} (${projectCode})
Status: Completed

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function projectArchivedTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, userName, projectUrl } = params;

  const subject = `Project Archived: ${projectName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Project Archived</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A project has been archived:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6b7280; margin-bottom: 20px;">
      <h2 style="color: #6b7280; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0; color: #6b7280;">Status: Archived</p>
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Archived Project</a>
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
Project Archived: ${projectName}

Hi ${userName},

A project has been archived:

Project: ${projectName} (${projectCode})
Status: Archived

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function budgetThresholdReachedTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, budget, budgetSpent, userName, projectUrl } = params;

  const percentageUsed = budget && budgetSpent ? Math.round((budgetSpent / budget) * 100) : 0;

  const subject = `🚨 Budget Alert: ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Budget Alert</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A project has reached its budget threshold:</p>

    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 20px;">
      <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0;"><strong>Total Budget:</strong> $${budget?.toLocaleString()}</p>
      <p style="margin: 8px 0;"><strong>Amount Spent:</strong> $${budgetSpent?.toLocaleString()}</p>
      <p style="margin: 8px 0; font-size: 18px; color: #dc2626;"><strong>Budget Used: ${percentageUsed}%</strong></p>
    </div>

    <p style="font-size: 14px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 6px; margin: 20px 0;">
      ⚠️ Please review the project budget and take necessary action.
    </p>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Review Budget</a>
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
🚨 Budget Alert: ${projectName}

Hi ${userName},

A project has reached its budget threshold:

Project: ${projectName} (${projectCode})
Total Budget: $${budget?.toLocaleString()}
Amount Spent: $${budgetSpent?.toLocaleString()}
Budget Used: ${percentageUsed}%

⚠️ Please review the project budget and take necessary action.

${projectUrl ? `Review Budget: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function teamMemberAddedToProjectTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, teamMemberName, userName, projectUrl } = params;

  const subject = `Team Member Added to ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">Team Update</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A new team member has been added to your project:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0;"><strong>New Team Member:</strong> ${teamMemberName}</p>
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Team</a>
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
Team Member Added to ${projectName}

Hi ${userName},

A new team member has been added to your project:

Project: ${projectName} (${projectCode})
New Team Member: ${teamMemberName}

${projectUrl ? `View Team: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function teamMemberRemovedFromProjectTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, teamMemberName, userName, projectUrl } = params;

  const subject = `Team Member Removed from ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">Team Update</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A team member has been removed from your project:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #6b7280; margin-bottom: 20px;">
      <h2 style="color: #6b7280; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0;"><strong>Removed Team Member:</strong> ${teamMemberName}</p>
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Team</a>
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
Team Member Removed from ${projectName}

Hi ${userName},

A team member has been removed from your project:

Project: ${projectName} (${projectCode})
Removed Team Member: ${teamMemberName}

${projectUrl ? `View Team: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function projectPriorityChangedTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, priority, userName, projectUrl } = params;

  const subject = `Project Priority Changed: ${projectName}`;

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

    <p style="font-size: 16px; margin-bottom: 20px;">The priority of a project has been changed:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0;"><strong>New Priority:</strong> <span style="text-transform: uppercase; font-weight: bold;">${priority}</span></p>
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Project</a>
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
Project Priority Changed: ${projectName}

Hi ${userName},

The priority of a project has been changed:

Project: ${projectName} (${projectCode})
New Priority: ${priority?.toUpperCase()}

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function projectOverdueTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, dueDate, daysOverdue, userName, projectUrl } = params;

  const subject = `🚨 Project Overdue: ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">🚨 Project Overdue</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A project has passed its deadline:</p>

    <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 20px;">
      <h2 style="color: #ef4444; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0;"><strong>Due Date:</strong> ${dueDate}</p>
      <p style="margin: 8px 0; font-size: 18px; color: #dc2626;"><strong>Days Overdue: ${daysOverdue}</strong></p>
    </div>

    <p style="font-size: 14px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 6px; margin: 20px 0;">
      ⚠️ This project requires immediate attention.
    </p>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Project</a>
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
🚨 Project Overdue: ${projectName}

Hi ${userName},

A project has passed its deadline:

Project: ${projectName} (${projectCode})
Due Date: ${dueDate}
Days Overdue: ${daysOverdue}

⚠️ This project requires immediate attention.

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function projectStageAdvancedTemplate(params: ProjectEmailParams) {
  const { projectName, projectCode, stage, userName, projectUrl } = params;

  const subject = `Project Stage Advanced: ${projectName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">Stage Progress</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A project has advanced to the next stage:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
      <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">${projectName}</h2>
      <p style="margin: 8px 0;"><strong>Project Code:</strong> ${projectCode}</p>
      <p style="margin: 8px 0;"><strong>Current Stage:</strong> ${stage}</p>
    </div>

    ${projectUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${projectUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Project</a>
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
Project Stage Advanced: ${projectName}

Hi ${userName},

A project has advanced to the next stage:

Project: ${projectName} (${projectCode})
Current Stage: ${stage}

${projectUrl ? `View Project: ${projectUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}
