import { getSupabaseClient } from "./prisma";
import { PrismaClient as PrismaClientSupabase } from "@/prisma/generated/supabase-client";
import { ResponseData } from "@/types/global";

export class SupabaseRepository {
  static instance: SupabaseRepository | null = null;
  private client: PrismaClientSupabase | null = null;

  static getSupabaseInstance() {
    if (!this.instance) {
      this.instance = new SupabaseRepository();
    }
    return this.instance;
  }

  constructor() {
    this.client = getSupabaseClient();
  }

  async getAllPasswods(user_email: string) : Promise<ResponseData> {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }
    try {
      const allPasswords = await this.client.password.findMany({
          where: {
              user_email: user_email,
            }
        }
      );
      return {data: allPasswords};
    } catch (err: any) {
      return { error: err.message || "Failed to get users!" };
    }
  }

  async getPasswordByDesc(keyword: string) : Promise<ResponseData>  {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }
    try {
      const passwords = await this.client.password.findMany({
        where: {
          description: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      });
      console.log("passwords from supabaseclient:", passwords);
      if (passwords.length === 0) {
        return { error: "User not found!" };
      } else {
        return { data: passwords };
      }
    } catch (err: any) {
      console.error(err);
      return { error: err.message || "Failed to get user!" };
    }
  }

  async savePassword(
    description: string,
    user_name: string,
    password: string,
    user_email: string
  ) : Promise<ResponseData> {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }

    try {
      const result = await this.client.password.create({
        data: {
          description,
          user_name,
          password,
          user_email,
        },
      });
      return { data: result };
    } catch (err: any) {
      return { error: err.message || "Failed to save password!" };
    }
  }

  async deletePassword(
    user_email: string,
    description: string
  ) : Promise<ResponseData> {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }

    try {
      const result = await this.client.password.delete({
        where: {
          description_user_email: {
            description,
            user_email,
          },
        },
      });
      return { data: result };
    } catch (err: any) {
      return { error: err.message || "Failed to delete password!" };
    }
  }
}
