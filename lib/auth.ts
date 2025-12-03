import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const secret = new TextEncoder().encode(JWT_SECRET);

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT Token generation and verification
export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret);

  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// OTP generation
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Reset token generation
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// OTP expiry time (10 minutes)
export function getOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}

// Reset token expiry time (1 hour)
export function getResetTokenExpiry(): Date {
  return new Date(Date.now() + 60 * 60 * 1000);
}
