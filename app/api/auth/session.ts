import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export type AuthenticatedSession = {
  userId: string;
  email?: string;
  name?: string;
};

export function getAuthenticatedSession(
  req: NextRequest
): AuthenticatedSession | null {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub?: string;
      email?: string;
      name?: string;
    };

    if (!decoded.sub) {
      return null;
    }

    return {
      userId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}