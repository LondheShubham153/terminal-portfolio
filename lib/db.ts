import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { resolveDatabaseUrl } from "./db-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const url = resolveDatabaseUrl(process.env.DATABASE_URL || "file:./dev.db");
  const isRemote = url.startsWith("libsql:") || url.startsWith("http");
  const authToken = isRemote ? process.env.TURSO_AUTH_TOKEN : undefined;

  if (isRemote && !authToken) {
    throw new Error(
      "DATABASE_URL is a remote libsql:// URL but TURSO_AUTH_TOKEN is not set — refusing to connect unauthenticated.",
    );
  }

  const adapter = new PrismaLibSQL({ url, authToken });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
