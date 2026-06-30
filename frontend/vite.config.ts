import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import glsl from "vite-plugin-glsl";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
  },

  plugins: [
    react(),
    glsl(),
    (mode === "development" ? [componentTagger()] : []),
    (mode === "analyze" ?
      [visualizer({
        filename: "dist/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      })] : []),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));