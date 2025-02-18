import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "not found"; // Secret key for JWT verification

export async function middleware(req: NextRequest) {
  const verifyed = await verifyToken(req, JWT_SECRET);

  if (!verifyed) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();

}

async function verifyToken(
  req: NextRequest,
  jwt_secret: string
): Promise<Object | null> {
  const tokenCookie = req.cookies.get("token");

  if (!tokenCookie || jwt_secret === "not found") {
    console.log("No token found");
    return null;
  }

  const token = tokenCookie.value;
  const secret = new TextEncoder().encode(jwt_secret);
  try {
    const data = await jwtVerify(token, secret);
    return data;
  } catch {
    return null;
  }

}

export const config = {
  matcher: ["/"],
};
