"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { SqliteRepository } from "@/src/repositories/sqlite";

const sqlite = SqliteRepository.getSqliteInstance();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("created user backend touched");
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res
      .status(400)
      .json({ error: "Name, email, and password are required", data: {} });
    return;
  }
  try {
    const user = await sqlite.createUser({ name, email, password });
    if ("error" in user) {
      return res.status(404).json({ error: "Failed to create user", data: {} });
    } else {
      return res
        .status(201)
        .json({ message: "User created successfully", data: user });
    }
  } catch (e: unknown) {
    const err = e as {message?: string, data?: object}
    return res
      .status(500)
      .json({
        error: err.message || "Failed to create user",
        data: err.data || {},
      });
  }
}
