import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "E-UBMA Student Portal",
        short_name: "E-UBMA",
        description: "Official University Student Space and Secure Document Vault",
        theme_color: "#1a1a1a",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/ubma-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/ubma-logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
  },
});
