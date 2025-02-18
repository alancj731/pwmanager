import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== "GET") {
        res.status(405).end();
        return;
    }

    res.setHeader('Set-Cookie', 'token=; Max-Age=0; Path=/; HttpOnly');
    res.send({ message: 'User logged out and token removed' });
}