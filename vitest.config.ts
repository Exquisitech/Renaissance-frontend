import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    css: true,
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "components/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "lib/notification-service.ts",
        "lib/utils.ts",
      ],
      exclude: [
        "components/ui/**/index.ts",
        "tests/**",
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});