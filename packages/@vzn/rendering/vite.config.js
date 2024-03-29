import path from "path";
import { defineConfig } from "vite";

module.exports = defineConfig({
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["cjs", "es"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["@vzn/reactivity"],
    },
  },
  resolve: {
    alias: {
      rxcore: path.resolve(
        __dirname,
        "../../../packages/@vzn/rendering/src/core"
      ),
    },
  },
});
