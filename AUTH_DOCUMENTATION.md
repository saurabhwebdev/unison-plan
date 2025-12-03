# Authentication System Documentation

## Overview

This is a complete role-based authentication system with email notifications for a Next.js project tracking application. The system includes user signup with OTP verification, login/logout with email notifications, password reset functionality, and role-based access control.

## Features

### ✅ Core Authentication Features

1. **User Registration (Signup)**
   - Email-based registration
   - Password hashing with bcrypt
   - OTP verification via email
   - Username uniqueness validation

2. **Email Verification**
   - 6-digit OTP sent to email
   - 10-minute expiration time
   - Prevents login until verified

3. **User Login**
   - Username or email login
   - JWT token-based authentication
   - HTTP-only cookie storage
   - Email notification on successful login

4. **User Logout**
   - Token invalidation
   - Email notification on logout
   - Secure cookie clearing

5. **Password Reset**
   - Forgot password flow with email link
   - Secure reset token (1-hour expiration)
   - Email confirmation after reset

6. **Role-Based Access Control**
   - Three roles: `admin`, `manager`, `user`
   - Middleware for protected routes
   - Role-based authorization

### 📧 Email Notifications

The system sends professional HTML emails for:
- OTP verification
- Login notifications (with IP and device info)
- Logout confirmations
- Password reset links
- Password reset confirmations

## Default Admin User

### Credentials
- **Username:** `admin`
- **Password:** `admin`
- **Email:** `admin@projecttracker.local`
- **Role:** `admin`
- **Status:** Pre-verified

### Creating the Admin User

Run the seed script to create the default admin user:

```bash
npm run seed-admin
```

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

## API Endpoints

### Authentication Routes

#### 1. POST `/api/auth/signup`
Register a new user and send OTP verification email.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for OTP verification.",
  "userId": "user_id_here"
}
```

#### 2. POST `/api/auth/verify-otp`
Verify email with OTP code.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account verified successfully! You can now log in."
}
```

#### 3. POST `/api/auth/login`
Login user and send email notification.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### 4. POST `/api/auth/logout`
Logout user and send email notification.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### 5. GET `/api/auth/me`
Get current authenticated user details.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 6. POST `/api/auth/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If the email exists, a password reset link has been sent."
}
```

#### 7. POST `/api/auth/reset-password`
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now log in with your new password."
}
```

## User Roles

### Role Hierarchy

1. **Admin** (`admin`)
   - Full system access
   - Can manage all users and projects
   - Pre-seeded default admin account

2. **Manager** (`manager`)
   - Can manage assigned projects
   - Can view team members
   - Limited administrative access

3. **User** (`user`)
   - Basic access
   - Can view and manage own projects
   - Default role for new signups

## Authentication Flow

### Signup Flow
```
1. User fills signup form
2. System validates input
3. Password is hashed with bcrypt
4. OTP is generated (6-digit, 10min expiry)
5. User record created (isVerified: false)
6. OTP sent via email
7. User enters OTP
8. Account verified
9. User can now login
```

### Login Flow
```
1. User enters username/email + password
2. System finds user
3. Checks if email is verified
4. Verifies password with bcrypt
5. Generates JWT token (7-day expiry)
6. Token stored in HTTP-only cookie
7. Login email notification sent
8. User redirected to dashboard
```

### Password Reset Flow
```
1. User requests password reset
2. System generates secure token
3. Reset link emailed (1-hour expiry)
4. User clicks link with token
5. User enters new password
6. Password hashed and updated
7. Token invalidated
8. Confirmation email sent
9. User can login with new password
```

## Middleware Usage

### Protecting Routes

Use the authentication middleware to protect API routes:

```typescript
import { authMiddleware } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  // Require authentication
  const auth = await authMiddleware(request);

  if (!auth.success) {
    return auth.response; // Returns 401 Unauthorized
  }

  // Access user data
  const user = auth.user;

  // Your protected code here
}
```

### Role-Based Protection

Restrict access to specific roles:

```typescript
import { authMiddleware } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  // Only allow admin and manager
  const auth = await authMiddleware(request, ["admin", "manager"]);

  if (!auth.success) {
    return auth.response; // Returns 401 or 403
  }

  // Your protected code here
}
```

## Security Features

### Password Security
- Bcrypt hashing with salt rounds (10)
- Minimum 6 characters required
- Password never stored in plain text

### Token Security
- JWT with HS256 algorithm
- 7-day expiration
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production

### OTP Security
- 6-digit random numbers
- 10-minute expiration
- Single-use (deleted after verification)

### Reset Token Security
- 32-byte random hex string
- 1-hour expiration
- Single-use (deleted after reset)

## Environment Variables

Required environment variables in `.env.local`:

```env
# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# MongoDB
MONGODB_URI=mongodb://localhost:27017/project-tracker

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Project Tracker

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Schema

### User Model

```typescript
{
  username: string (unique, required, 3-30 chars)
  email: string (unique, required, valid email)
  password: string (required, hashed, min 6 chars)
  role: "admin" | "user" | "manager" (default: "user")
  isVerified: boolean (default: false)
  otp: string (optional, for email verification)
  otpExpires: Date (optional)
  resetPasswordToken: string (optional)
  resetPasswordExpires: Date (optional)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## UI Pages

### Available Routes

- `/` - Redirects to login
- `/login` - User login page
- `/signup` - User registration with OTP verification
- `/forgot-password` - Request password reset
- `/reset-password?token=xxx` - Reset password with token
- `/dashboard` - Protected dashboard (requires authentication)

## Getting Started

### 1. Setup Environment

Copy `.env.example` to `.env.local` and update values:

```bash
cp .env.example .env.local
```

### 2. Configure Gmail

1. Enable 2-Step Verification in Google Account
2. Generate App Password
3. Add credentials to `.env.local`

### 3. Start MongoDB

Local:
```bash
mongod
```

Or update `MONGODB_URI` for MongoDB Atlas.

### 4. Seed Admin User

```bash
npm run seed-admin
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Test the System

1. Visit `http://localhost:3000` (redirects to login)
2. Login with admin credentials:
   - Username: `admin`
   - Password: `admin`
3. Or create a new account via signup

## Email Templates

All emails include:
- Professional HTML design
- Plain text fallback
- Responsive layout
- Company branding
- Clear call-to-action

Templates are modular and customizable in `lib/emailTemplates.ts`.

## Testing Checklist

- [ ] User signup with valid data
- [ ] Email OTP received
- [ ] OTP verification works
- [ ] Cannot login without verification
- [ ] Login with username works
- [ ] Login with email works
- [ ] Login email notification received
- [ ] Dashboard loads after login
- [ ] User info displays correctly
- [ ] Logout works
- [ ] Logout email notification received
- [ ] Forgot password email received
- [ ] Password reset link works
- [ ] Password reset confirmation email received
- [ ] Can login with new password
- [ ] Admin user exists
- [ ] Protected routes block unauthenticated users
- [ ] Role-based access works

## Best Practices

### Security
- Always use HTTPS in production
- Change default admin password immediately
- Use strong JWT secret (long random string)
- Regularly rotate secrets
- Never commit `.env.local` to Git

### Email
- Test email configuration thoroughly
- Monitor email delivery rates
- Have fallback for email failures
- Consider rate limiting for OTP requests

### Database
- Keep MongoDB updated
- Regular backups
- Use indexes for performance
- Monitor connection pool

## Troubleshooting

### Common Issues

**Email not sending:**
- Check Gmail app password is correct
- Verify 2-Step Verification is enabled
- Check EMAIL_USER and EMAIL_PASSWORD in .env.local

**OTP expired:**
- OTP is valid for 10 minutes only
- Request new OTP by signing up again

**Cannot login:**
- Ensure email is verified (check OTP)
- Verify password is correct
- Check MongoDB is running

**Token errors:**
- Clear browser cookies
- Check JWT_SECRET is set
- Verify token hasn't expired (7 days)

## Future Enhancements

Potential improvements:
- [ ] Social auth (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Session management (active sessions list)
- [ ] Account lockout after failed attempts
- [ ] Email verification resend
- [ ] Remember me functionality
- [ ] Account deletion
- [ ] Profile picture upload
- [ ] Activity logs
- [ ] API rate limiting

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in console
3. Verify environment variables
4. Check MongoDB connection
5. Test email configuration

---

**Version:** 1.0.0
**Last Updated:** December 2024
