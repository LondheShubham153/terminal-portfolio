import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // The real package throws outside Next's build (no "react-server"
      // condition applied), so tests get a no-op instead.
      "server-only": new URL("./lib/test/server-only-stub.ts", import.meta.url).pathname,
    },
  },
});
