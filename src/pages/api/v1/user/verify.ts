import { NextApiResponse, NextApiRequest } from "next";
import { jwtVerify, JWTVerifyResult } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "not found";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  const verified = await verifyToken(req, JWT_SECRET);
  if (!verified) {
    return res.status(401).json({ error: "Invalid token" });
  }
  return res.status(200).json({ data: verified.payload });
}

export async function verifyToken(
  req: NextApiRequest,
  jwt_secret: string
): Promise<JWTVerifyResult | null> {

  const token = req.cookies.token;

  if (!token || jwt_secret === "not found") {
    console.log("No token found");
    return null;
  }

  const secret = new TextEncoder().encode(jwt_secret);
  try {
    const data = await jwtVerify(token, secret);
    return data;
  } catch {
    return null;
  }

}
