"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { SqliteRepository } from "@/src/repositories/sqlite";

const sqlite = SqliteRepository.getSqliteInstance();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;
  console.log("email in backend:", email);

  if (!email || email.length === 0) {
    return res.status(400).json({ error: "Email is required", data: {} });
  }

  try {
    const result = await sqlite.getUserByEmail(email as string);
    if ("error" in result) {
      return res.status(404).json({ error: "User not found", data: {} });
    } else {
      return res.status(200).json({ message: "User found!"});
    }
  } catch (e: unknown) {
    const err = e as {message?: string, data?: object}
    return res.status(500).json({
      error: err.message || "Failed to get user!",
      data: err.data || {},
    });
  }
}
