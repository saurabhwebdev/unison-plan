import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "./auth";

export interface AuthRequest extends NextRequest {
  user?: JWTPayload;
}

// Middleware to check if user is authenticated
export async function requireAuth(request: NextRequest): Promise<{
  success: boolean;
  user?: JWTPayload;
  response?: NextResponse;
}> {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      ),
    };
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized - Invalid token" },
        { status: 401 }
      ),
    };
  }

  return {
    success: true,
    user: payload,
  };
}

// Middleware to check if user has required role
export function requireRole(
  user: JWTPayload,
  allowedRoles: string[]
): { success: boolean; response?: NextResponse } {
  if (!allowedRoles.includes(user.role)) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Forbidden - You don't have permission to access this resource",
        },
        { status: 403 }
      ),
    };
  }

  return { success: true };
}

// Combined middleware for auth + role check
export async function authMiddleware(
  request: NextRequest,
  allowedRoles?: string[]
): Promise<{
  success: boolean;
  user?: JWTPayload;
  response?: NextResponse;
}> {
  // Check authentication
  const authResult = await requireAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  // If roles are specified, check role
  if (allowedRoles && allowedRoles.length > 0) {
    const roleResult = requireRole(authResult.user!, allowedRoles);

    if (!roleResult.success) {
      return roleResult;
    }
  }

  return {
    success: true,
    user: authResult.user,
  };
}

// Simplified auth verification that returns authenticated status and user
export async function verifyAuth(request: NextRequest): Promise<{
  authenticated: boolean;
  user: (JWTPayload & { _id: any }) | null;
}> {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      authenticated: false,
      user: null,
    };
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return {
      authenticated: false,
      user: null,
    };
  }

  return {
    authenticated: true,
    user: payload as JWTPayload & { _id: any },
  };
}
