import prisma from '@prisma/client';
import { PrismaClient as PrismaClientSqlite } from  '../../prisma/generated/sqlite-client';
import { PrismaClient as PrismaClientSupabase } from '../../prisma/generated/supabase-client';


let sqliteClient : PrismaClientSqlite | null = null;
let supabaseClient : PrismaClientSupabase | null = null;

export function getSqliteClient() : PrismaClientSqlite {
    if(!sqliteClient){
        sqliteClient = new PrismaClientSqlite();
    }
    return sqliteClient;
}

export function getSupabaseClient() : PrismaClientSupabase {
    if(!supabaseClient){
        supabaseClient = new PrismaClientSupabase();
    }
    return supabaseClient;
}