interface ClientEmailParams {
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  userName: string;
  userEmail: string;
  assignedBy?: string;
  status?: string;
  oldStatus?: string;
  newStatus?: string;
  priority?: string;
  industry?: string;
  notes?: string;
  clientUrl?: string;
}

export function clientCreatedTemplate(params: ClientEmailParams) {
  const { clientName, clientCompany, clientEmail, industry, userName, clientUrl } = params;

  const subject = `New Client Added: ${clientName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">New Client Added</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A new client has been added to the system:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${clientName}</h2>
      ${clientCompany ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${clientCompany}</p>` : ''}
      ${clientEmail ? `<p style="margin: 8px 0;"><strong>Email:</strong> ${clientEmail}</p>` : ''}
      ${industry ? `<p style="margin: 8px 0;"><strong>Industry:</strong> ${industry}</p>` : ''}
    </div>

    ${clientUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${clientUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Client</a>
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
New Client Added: ${clientName}

Hi ${userName},

A new client has been added to the system:

Client Name: ${clientName}
${clientCompany ? `Company: ${clientCompany}` : ''}
${clientEmail ? `Email: ${clientEmail}` : ''}
${industry ? `Industry: ${industry}` : ''}

${clientUrl ? `View Client: ${clientUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function clientAssignedTemplate(params: ClientEmailParams) {
  const { clientName, clientCompany, assignedBy, userName, clientUrl } = params;

  const subject = `Client Assigned to You: ${clientName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">Client Assignment</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">You have been assigned to manage a client:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
      <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">${clientName}</h2>
      ${clientCompany ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${clientCompany}</p>` : ''}
      ${assignedBy ? `<p style="margin: 8px 0;"><strong>Assigned By:</strong> ${assignedBy}</p>` : ''}
    </div>

    ${clientUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${clientUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Client Details</a>
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
Client Assigned to You: ${clientName}

Hi ${userName},

You have been assigned to manage a client:

Client Name: ${clientName}
${clientCompany ? `Company: ${clientCompany}` : ''}
${assignedBy ? `Assigned By: ${assignedBy}` : ''}

${clientUrl ? `View Client: ${clientUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function clientStatusChangedTemplate(params: ClientEmailParams) {
  const { clientName, clientCompany, oldStatus, newStatus, userName, clientUrl } = params;

  const subject = `Client Status Updated: ${clientName}`;

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

    <p style="font-size: 16px; margin-bottom: 20px;">The status of a client has been updated:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${clientName}</h2>
      ${clientCompany ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${clientCompany}</p>` : ''}
      <div style="display: flex; align-items: center; margin: 15px 0;">
        <span style="background: #f3f4f6; padding: 8px 16px; border-radius: 6px; margin-right: 10px;">${oldStatus || 'N/A'}</span>
        <span style="font-size: 20px;">→</span>
        <span style="background: #667eea; color: white; padding: 8px 16px; border-radius: 6px; margin-left: 10px;">${newStatus}</span>
      </div>
    </div>

    ${clientUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${clientUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Client</a>
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
Client Status Updated: ${clientName}

Hi ${userName},

The status of a client has been updated:

Client: ${clientName}
${clientCompany ? `Company: ${clientCompany}` : ''}
Previous Status: ${oldStatus || 'N/A'}
New Status: ${newStatus}

${clientUrl ? `View Client: ${clientUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function clientNoteAddedTemplate(params: ClientEmailParams) {
  const { clientName, clientCompany, notes, userName, clientUrl } = params;

  const subject = `Note Added to Client: ${clientName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">New Note Added</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A note has been added to a client record:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${clientName}</h2>
      ${clientCompany ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${clientCompany}</p>` : ''}
      ${notes ? `
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 15px;">
        <p style="margin: 0; font-style: italic; color: #555;">"${notes}"</p>
      </div>
      ` : ''}
    </div>

    ${clientUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${clientUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Client</a>
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
Note Added to Client: ${clientName}

Hi ${userName},

A note has been added to a client record:

Client: ${clientName}
${clientCompany ? `Company: ${clientCompany}` : ''}
${notes ? `Note: "${notes}"` : ''}

${clientUrl ? `View Client: ${clientUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function clientProjectStartedTemplate(params: ClientEmailParams) {
  const { clientName, clientCompany, userName, clientUrl } = params;

  const subject = `New Project Started for ${clientName}`;

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
    <h1 style="color: white; margin: 0; font-size: 28px;">New Project Started</h1>
  </div>

  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>

    <p style="font-size: 16px; margin-bottom: 20px;">A new project has been started for one of your clients:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 20px;">
      <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">${clientName}</h2>
      ${clientCompany ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${clientCompany}</p>` : ''}
      <p style="margin: 8px 0; color: #059669;">🚀 A new project has been initiated</p>
    </div>

    ${clientUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${clientUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Client</a>
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
New Project Started for ${clientName}

Hi ${userName},

A new project has been started for one of your clients:

Client: ${clientName}
${clientCompany ? `Company: ${clientCompany}` : ''}
Status: Project Initiated

${clientUrl ? `View Client: ${clientUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}

export function clientPriorityChangedTemplate(params: ClientEmailParams) {
  const { clientName, clientCompany, priority, userName, clientUrl } = params;

  const subject = `Client Priority Changed: ${clientName}`;

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

    <p style="font-size: 16px; margin-bottom: 20px;">The priority of a client has been changed:</p>

    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 20px;">
      <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">${clientName}</h2>
      ${clientCompany ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${clientCompany}</p>` : ''}
      <p style="margin: 8px 0;"><strong>New Priority:</strong> <span style="text-transform: uppercase; font-weight: bold;">${priority}</span></p>
    </div>

    ${clientUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${clientUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Client</a>
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
Client Priority Changed: ${clientName}

Hi ${userName},

The priority of a client has been changed:

Client: ${clientName}
${clientCompany ? `Company: ${clientCompany}` : ''}
New Priority: ${priority?.toUpperCase()}

${clientUrl ? `View Client: ${clientUrl}` : ''}

This is an automated notification from Unison Plan.
  `;

  return { subject, html, text };
}
