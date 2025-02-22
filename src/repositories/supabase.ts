import { getClient } from "./prisma";
import { PrismaClient } from "@prisma/client";
import { ResponseData } from "@/src/types/global";

export class SupabaseRepository {
  static instance: SupabaseRepository | null = null;
  private client: PrismaClient | null = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SupabaseRepository();
    }
    return this.instance;
  }

  constructor() {
    this.client = getClient();
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
    } catch (e: unknown) {
      const err = e as {message?: string, data?: object};
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
    } catch (e: unknown) {
      const err = e as {message?: string, data?: object};
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
    } catch (e: unknown) {
      const err = e as {message?: string, data?: object};
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
    } catch (e: unknown) {
      const err = e as {message?: string, data?: object};
      return { error: err.message || "Failed to delete password!" };
    }
  }

  // ----------------------below is for User table---------------------------
  async getAllUsers() {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }
    try {
      const allUsers = await this.client.user.findMany();
      return allUsers;
    } catch (e: unknown) {
      const err = e as {message?: string, data?: object}
      return { error: err.message || "Failed to get users!" };
    }
  }

  async getUserByEmail(email: string) {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }
    try {
      const user = await this.client.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return { error: "User not found!" };
      } else {
        return user;
      }
    } catch (e: unknown) {
      const err = e as {message?: string, data?: object}
      console.error(err);
      return { error: err.message || "Failed to get user!" };
    }
  }

  async createUser(data: { email: string; name: string; password: string }) {
    console.log("prisma create user touched", data);
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }

    try {
      const result = await this.client.user.create({
        data: data,
      });

      return result;
    } catch (e: unknown) {
      console.log("error in create user", e);
      const err = e as {message?: string, data?: object}
      return { error: err.message || "Failed to create user!" };
    }
  }

  async updateUser(
    email: string,
    data: { email: string; name?: string; password?: string }
  ) {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }

    try {
      const updateData: { email: string; name?: string; password?: string } = {
        email: email,
      };

      if (data.name) updateData.name = data.name;
      if (data.password) updateData.password = data.password;

      const result = await this.client.user.update({
        where: {
          email: email,
        },
        data: updateData,
      });
      
      return result;
    } 
    catch (e: unknown) {
      const err = e as {message?: string, data?: object}
      return { error: err.message || "Failed to update user!" };
    }
  }

  async deleteUser(email: string) {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }

    try {
      const result = await this.client.user.delete({
        where: {
          email: email,
        },
      });
      return result;
    } catch (e: unknown) {
      const err = e as {message?: string, data?: object}
      return { error: err.message || "Failed to delete user!" };
    }
  }
}
