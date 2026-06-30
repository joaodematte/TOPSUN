import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  deps: {
    alwaysBundle: [/@topsun\/.*/u],
    neverBundle: ["playwright", "playwright-core"],
  },
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
});
