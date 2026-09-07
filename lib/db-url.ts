import path from "node:path";

/**
 * A local "file:./dev.db" DATABASE_URL is written relative to prisma/schema.prisma
 * (that's what Prisma CLI commands like `migrate` resolve it against), but
 * @libsql/client resolves relative "file:" URLs against process.cwd() instead —
 * which differs whenever the app doesn't run from the project root. Resolving
 * to an absolute path here keeps both resolution rules pointing at the same
 * file. A remote "libsql://..." URL (Turso, production) passes through unchanged.
 */
export function resolveDatabaseUrl(url: string, cwd: string = process.cwd()): string {
  if (!url.startsWith("file:")) return url;
  const relativePath = url.slice("file:".length);
  const absolutePath = path.resolve(cwd, "prisma", relativePath);
  return `file:${absolutePath}`;
}
