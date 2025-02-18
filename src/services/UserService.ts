'use client'

import axios from 'axios';
import bcrypt from 'bcryptjs';
import { AxiosResponse } from 'axios';
import { ResponseData } from '@/types/global';

export async function logoutUser(){
    try{
        const response : AxiosResponse<ResponseData> = await axios.get("/api/v1/user/logout");
        if (response.status !== 200){
            return {error: response.data.error || "Failed to logout!", data: response.data.data || {}};
        }
        return {message: "Logout successful"};
    }
    catch(err : any){
        return {error: err.message || "Failed to logout!", data: err.data || {}};
    }
}

export async function createUser({name, email, password} : {name: string, email: string, password: string}) : Promise<ResponseData> {
    if (!name || !email || !password) {
        return {error: "Name, email, and password are required", data: {}};
    }
    try{
        const saltRounds = 10; // The number of salt rounds (higher is more secure, but slower)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const response : AxiosResponse<ResponseData> = await axios.post("/api/v1/user/create", {name, email, password: hashedPassword});
        if (response.status !== 201){
            return {error: response.data.error || "Failed to create user!", data: response.data.data || {}};
        }
        return {data: response.data.data};
    }
    catch(err : any){
        return {error: err.message || "Failed to create user!", data: err.data || {}};
    }
}

export async function getUserByEmail(email : string): Promise<ResponseData> {
    if (!email) {
        return {error: "Email is required", data: {}};
    }
    try{
        const emailURI = encodeURIComponent(email); 
        const response : AxiosResponse<ResponseData> = await axios.get(`/api/v1/user/${emailURI}`);

        if (response.status !== 200){
            return {error: response.data.data.error || "Failed to get user by email"};
        }
        return {message: "User found"};
    }
    catch(err : any){
        return {error: err.message || "Failed to get user!", data: err.data || {}};
    }
}

export async function userLogin({email, password} : {email: string, password: string}) : Promise<ResponseData> {
    if (!email || !password) {
        return {error: "Email and password are required", data: {}};
    }
    try{

        const response : AxiosResponse<ResponseData> = await axios.post("/api/v1/user/login", {email, password});
        if (response.status !== 200){
            return {error: response.data.error || "Failed to login!", data: response.data.data || {}};
        }
        else{
            return {message: "Login successful", data: response.data.data};
        }
    }
    catch(err : any){
        return {error: err.message || "Failed to login!", data: err.data || {}};
    }
}

