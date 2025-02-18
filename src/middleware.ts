import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const JWT_SECRET = process.env.JWT_SECRET || "not found"; // Secret key for JWT verification

export async function middleware(req: NextRequest) {
  const verifyed = await verifyToken(req, JWT_SECRET);

  if (!verifyed) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();

  // const tokenCookie = req.cookies.get("token");

  // if (!tokenCookie || JWT_SECRET === "not found") {
  //   console.log("No token found");
  //   return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if no token
  // } else {
  //   try {
  //     // Verify the token
  //     const token = tokenCookie.value;
  //     const secret = new TextEncoder().encode(JWT_SECRET);

  //     try {
  //       const data = await jwtVerify(token, secret);
  //       return NextResponse.next();
  //     } catch {
  //       return NextResponse.redirect(new URL("/login", req.url));
  //     }
  //   } catch (error) {
  //     // If the token is invalid, redirect to login
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  // }
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
  matcher: ["/", "/dashboard"],
};
