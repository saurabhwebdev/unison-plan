# Project Tracker - Internal SaaS Tool

An internal SaaS application for tracking team projects, built with Next.js, MongoDB, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: MongoDB (with Mongoose)
- **Email**: Nodemailer (Gmail)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Update the values in `.env.local` with your configuration

### Environment Configuration

#### MongoDB Setup

**Option 1: Local MongoDB (MongoDB Compass)**
```env
MONGODB_URI=mongodb://localhost:27017/project-tracker
```

**Option 2: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-tracker?retryWrites=true&w=majority
```

Simply update the `MONGODB_URI` in your `.env.local` file to switch between local and cloud databases.

#### Gmail Configuration

To send emails, you need to set up a Gmail App Password:

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the generated password

Update your `.env.local`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Project Tracker
```

### Running the Application

Development mode:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

Build for production:
```bash
npm run build
npm start
```

## Project Structure

```
├── app/                  # Next.js app router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # React components
├── lib/                 # Utility functions
│   ├── mongodb.ts       # MongoDB connection utility
│   ├── email.ts         # Email sending utility
│   └── utils.ts         # General utilities
├── .env.local          # Environment variables (not in git)
└── .env.example        # Environment variables template
```

## Using the Utilities

### MongoDB Connection

```typescript
import connectDB from "@/lib/mongodb";

// In your API route or server component
await connectDB();
// Now you can use Mongoose models
```

### Sending Emails

```typescript
import { sendEmail } from "@/lib/email";

await sendEmail({
  to: "recipient@example.com",
  subject: "Project Update",
  html: "<p>Your project has been updated.</p>",
  text: "Your project has been updated.",
});
```

## Adding shadcn/ui Components

Install individual components as needed:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
# etc.
```

## Next Steps

- Create your database models in a `models/` directory
- Build out your API routes in `app/api/`
- Add authentication (NextAuth.js recommended)
- Create your project management features
- Set up proper error handling and logging

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `EMAIL_HOST` | SMTP host (default: smtp.gmail.com) | No |
| `EMAIL_PORT` | SMTP port (default: 587) | No |
| `EMAIL_SECURE` | Use SSL/TLS (default: false) | No |
| `EMAIL_USER` | Gmail address | Yes |
| `EMAIL_PASSWORD` | Gmail app password | Yes |
| `EMAIL_FROM` | From email address | Yes |
| `EMAIL_FROM_NAME` | From name (default: Project Tracker) | No |
