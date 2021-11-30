import { defineConfig } from 'vite'
import VZN from "vite-plugin-vzn";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [tsconfigPaths(), VZN()],
});