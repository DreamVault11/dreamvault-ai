import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["node_modules"],
    setupFiles: [],
    coverage: {
      provider: "v8",
      include: ["src/lib/ai/**/*.ts"],
      exclude: ["src/lib/ai/__mocks__/**", "src/lib/ai/__tests__/**", "src/lib/ai/hooks/**"],
    },
  },
});
