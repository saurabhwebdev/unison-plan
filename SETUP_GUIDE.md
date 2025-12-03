# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed (or MongoDB Atlas account)
- Gmail account for sending emails

## Step-by-Step Setup

### 1. Install Dependencies (Already Done ✅)
```bash
npm install
```

### 2. Configure Environment Variables

Your `.env.local` is already configured, but verify these settings:

```env
# JWT Secret - CHANGE THIS IN PRODUCTION
JWT_SECRET=project-tracker-jwt-secret-key-2024

# MongoDB - Switch between local and Atlas
MONGODB_URI=mongodb://localhost:27017/project-tracker

# Email (Gmail) - UPDATE WITH YOUR CREDENTIALS
EMAIL_USER=worlddj0@gmail.com
EMAIL_PASSWORD=vaxl oroj lcah ducv  # Your Gmail App Password
EMAIL_FROM=worlddj0@gmail.com
```

### 3. Start MongoDB

If using local MongoDB:
```bash
# On Windows (if MongoDB is installed)
mongod

# Or use MongoDB Compass to start the server
```

If using MongoDB Atlas:
- Update `MONGODB_URI` in `.env.local` with your Atlas connection string

### 4. Create Default Admin User

```bash
npm run seed-admin
```

This creates:
- Username: `admin`
- Password: `admin`
- Email: `admin@projecttracker.local`
- Role: `admin` (pre-verified)

**⚠️ IMPORTANT:** Change the admin password after first login!

### 5. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000` and redirect to login.

### 6. Test the System

#### Option 1: Login as Admin
1. Go to `http://localhost:3000`
2. Login with:
   - Username: `admin`
   - Password: `admin`
3. You'll be redirected to the dashboard

#### Option 2: Create New Account
1. Click "Sign up" on login page
2. Fill in the signup form
3. Check your email for the OTP code
4. Enter the OTP to verify your account
5. Login with your new credentials

## Gmail App Password Setup

To send emails, you need a Gmail App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Go to **App passwords** (under 2-Step Verification)
5. Select **Mail** and **Other (Custom name)**
6. Enter "Project Tracker"
7. Click **Generate**
8. Copy the 16-character password
9. Paste it in `.env.local` as `EMAIL_PASSWORD`

**Note:** Remove any spaces from the app password!

## Available Routes

Once running, you can access:

- `/` - Redirects to login
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset request
- `/reset-password?token=xxx` - Password reset form
- `/dashboard` - Dashboard (requires authentication)

## Testing Authentication Features

### Test Signup Flow
1. Go to `/signup`
2. Create account with:
   - Username: `testuser`
   - Email: your actual email
   - Password: `password123`
3. Check email for OTP
4. Verify with OTP
5. Login with credentials

### Test Login Notifications
1. Login to your account
2. Check email for login notification
3. Should include IP and device info

### Test Logout Notifications
1. Click "Logout" in dashboard
2. Check email for logout confirmation

### Test Password Reset
1. Go to `/forgot-password`
2. Enter your email
3. Check email for reset link
4. Click link and set new password
5. Check email for confirmation
6. Login with new password

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running. Start it with `mongod` or MongoDB Compass.

### Email Not Sending
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution:**
- Verify Gmail App Password is correct
- Check 2-Step Verification is enabled
- Remove any spaces in the app password
- Update EMAIL_USER and EMAIL_PASSWORD in .env.local

### OTP Expired
```
OTP has expired. Please request a new one.
```
**Solution:** OTP is valid for 10 minutes. Sign up again to get a new OTP.

### Cannot Login After Signup
```
Please verify your email before logging in
```
**Solution:** Check your email and verify with the OTP code first.

### Token Error
```
Unauthorized - Invalid token
```
**Solution:**
- Clear browser cookies
- Login again
- Check JWT_SECRET is set in .env.local

## Project Structure

```
.
├── app/
│   ├── api/auth/          # Authentication API routes
│   │   ├── signup/        # User registration
│   │   ├── verify-otp/    # OTP verification
│   │   ├── login/         # User login
│   │   ├── logout/        # User logout
│   │   ├── me/            # Get current user
│   │   ├── forgot-password/  # Request password reset
│   │   └── reset-password/   # Reset password
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── forgot-password/   # Forgot password page
│   ├── reset-password/    # Reset password page
│   └── dashboard/         # Protected dashboard
├── lib/
│   ├── auth.ts            # Auth utilities (JWT, hashing, OTP)
│   ├── email.ts           # Email sending utilities
│   ├── emailTemplates.ts  # Email HTML templates
│   ├── middleware.ts      # Auth middleware
│   ├── mongodb.ts         # Database connection
│   └── utils.ts           # General utilities
├── models/
│   └── User.ts            # User database model
├── scripts/
│   └── seedAdmin.ts       # Admin user seed script
└── components/ui/         # shadcn/ui components (42 components)
```

## Next Steps

After setup is complete:

1. **Change Admin Password**
   - Login as admin
   - Go to profile settings (coming soon)
   - Update password

2. **Customize Email Templates**
   - Edit `lib/emailTemplates.ts`
   - Update branding and styling

3. **Build Your Features**
   - Create project models
   - Add project management routes
   - Build project UI components

4. **Deploy to Production**
   - Update MongoDB to Atlas
   - Set strong JWT_SECRET
   - Configure production email
   - Enable HTTPS

## Support Commands

```bash
# Start development server
npm run dev

# Create admin user
npm run seed-admin

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Quick Reference

**Default Admin:**
- Username: `admin`
- Password: `admin`

**OTP Expiry:** 10 minutes
**Reset Token Expiry:** 1 hour
**JWT Token Expiry:** 7 days

**Roles:**
- `admin` - Full access
- `manager` - Limited admin access
- `user` - Basic access (default)

---

**Ready to go!** 🚀 Start building your project tracking features!
