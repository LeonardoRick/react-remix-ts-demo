import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  db = global.__db;
}
// prisma variable to create, read, do whatever you want with prisma database
export { db };
