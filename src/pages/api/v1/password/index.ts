"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { SupabaseRepository } from "@/src/repositories/supabase";
import { ResponseData } from "@/types/global";
import { verifyToken } from "../user/verify";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "not found";
const supabase = SupabaseRepository.getSupabaseInstance();

interface PAY_LOAD {
  name : string;
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const verified = await verifyToken(req, JWT_SECRET_KEY);

  if(!verified) {
    return res.status(401).json({ error: "Unauthorized"});
  }

  const tokenPayload = verified.payload as unknown as PAY_LOAD;

  if (req.method === "GET") {
    return handleGet(req, res, tokenPayload); 
  }

  if (req.method === "POST") {
    return handlePost(req, res, tokenPayload); 
  }

  if (req.method === "DELETE") {
    return handleDelete(req, res, tokenPayload); 
  }

  return res.status(405).json({ error: "Method not allowed" });
}


export async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  tokenPayload: PAY_LOAD
) {
  const user_email : string = tokenPayload.email as string;
  const { description } = req.body;

  if (!user_email || !description) {
    return res
      .status(400)
      .json({ error: "User email and description are required", data: {} });
  }

  try {
    const result : ResponseData = await supabase.deletePassword(user_email, description);
    
    if ("error" in result) {
      return res.status(404).json({ error: "Failed to delete password", data: {} });
    } 
    else {
      return res
        .status(200)
        .json({ message: "Password deleted successfully", data: result.data });
    }
  } catch (err: any) {
    return res
      .status(500)
      .json({
        error: err.message || "Failed to delete password",
        data: err.data || {},
      });
  }
}

export  async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  tokenPayload: PAY_LOAD
) {
  

  const user_email : string = tokenPayload.email as string;

  try {
    if (!user_email) {
      return res.status(400).json({ error: "User email not found", data: {} });
    }

    const result : ResponseData = await supabase.getAllPasswods(user_email);
    if ("error" in result) {
      return res.status(404).json({ error: "Error in getting all passwords", data: {} });
    } else {
      return res.status(200).json({ message: "Passwords found!", data: result.data });
    }
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "Failed to get passwords!",
      data: err.data || {},
    });
  }
}

export  async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  tokenPayload: PAY_LOAD
) {
  const user_email : string = tokenPayload.email as string;
  
  const { description, user_name, password } = req.body;

  if (!user_email || !description || !user_name || !password) {
    return res
      .status(400)
      .json({ error: "User email, description, user name and password are required", data: {} });
  }
  
  try{
    const result : ResponseData = await supabase.savePassword(description, user_name, password, user_email);
    if ("error" in result) {
      return res.status(404).json({ error: "Failed to create password", data: {} });
    } else {
      return res
        .status(201)
        .json({ message: "Password created successfully", data: result.data });
    }
  }
  catch (err: any) {
    return res
      .status(500)
      .json({
        error: err.message || "Failed to create password",
        data: err.data || {},
      });
  }
}
