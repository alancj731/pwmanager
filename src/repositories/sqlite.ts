"use server";

import { getSqliteClient } from "./prisma";
import { PrismaClient as PrismaClientSqlite } from '../../prisma/generated/sqlite-client';

export class SqliteRepository {
  static instance: SqliteRepository | null = null;
  private client: PrismaClientSqlite | null = null;

  static getSqliteInstance() {
    if (!this.instance) {
      this.instance = new SqliteRepository();
    }
    return this.instance;
  }

  constructor() {
    this.client = getSqliteClient();
  }

  async getAllUsers() {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }
    try {
      const allUsers = await this.client.user.findMany();
      return allUsers;
    } catch (err: any) {
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
    } catch (err: any) {
      console.error(err);
      return { error: err.message || "Failed to get user!" };
    }
  }

  async createUser(data: { email: string; name: string; password: string }) {
    if (!this.client) {
      return { error: "Prisma client does not exist!" };
    }

    try {
      const result = await this.client.user.create({
        data: data,
      });

      return result;
    } catch (err: any) {
      return { error: err.message || "Failed to create user!" };
    }
  }

  async update(
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
    catch (err: any) {
      return { error: err.message || "Failed to update user!" };
    }
  }

  async delete(email: string) {
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
    } catch (err: any) {
      return { error: err.message || "Failed to delete user!" };
    }
  }
} // end of class
