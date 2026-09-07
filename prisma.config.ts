import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { resolveDatabaseUrl } from "./lib/db-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  experimental: {
    adapter: true,
  },
  engine: "js",
  adapter: async () => {
    const url = resolveDatabaseUrl(process.env.DATABASE_URL || "file:./dev.db");
    return new PrismaLibSQL({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  },
});
