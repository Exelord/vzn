import { defineConfig } from 'vite'
import VZN from "vite-plugin-vzn";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [VZN()],
});