import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import type { NextApiRequest, NextApiResponse } from "next";
import { SqliteRepository } from "@/src/repositories/sqlite";
import { UserInDB } from '@/types/global';
import { serialize } from 'cookie'


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "not found";
const sqlite = SqliteRepository.getSqliteInstance();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).end();
        return;
    }
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400).json({error: "Email, and password are required"});
        return;
    }
    try {
        const result = await sqlite.getUserByEmail(email);
        if ('error' in result) {
            res.status(404).json({error: "User does not exist!"});
            return;
        }
        const user = result as UserInDB;

        const matched = await checkPassword(user, password);
        if (!matched){
            res.status(401).json({error: "Invalid password"});
            return;
        }

        const payload = {
            name: user.name,
            email: user.email,
        }
        
        if (JWT_SECRET_KEY === "not found") {
            console.error("JWT_SECRET_KEY not found in environment variables");
        }

        const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "1h"});

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        }

        const cookieString = serialize('token', token, cookieOptions)

        res.setHeader('Set-Cookie', cookieString)
        res.status(200).json({data: {name: user.name, email: user.email}});

    } catch (err: any) {
        res.status(500).json({error: err.message || "Failed to create user", data: err.data || {}});
    }

}

async function checkPassword(user: UserInDB, password : string) {
    if (!user || !user.password || !password){
        return false
    }
    return await bcrypt.compare(password, user.password);
}