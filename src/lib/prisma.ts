// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Force-reloading client for schema change (Amenity refactor)
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
