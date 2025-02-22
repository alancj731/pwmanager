import { PrismaClient  } from  '@prisma/client';


let client : PrismaClient | null = null;

export function getClient() : PrismaClient {
    if(!client){
        client = new PrismaClient();
    }
    return client;
}

