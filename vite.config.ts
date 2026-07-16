import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const DEFAULT_BASE_PATH = "/";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_APP_BASE_PATH || DEFAULT_BASE_PATH;

  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("react") || id.includes("scheduler")) return "react-vendor";
            if (id.includes("@supabase") || id.includes("@tanstack")) return "data-vendor";
            if (id.includes("recharts")) return "charts-vendor";
            if (id.includes("hls.js")) return "hls-vendor";
            if (id.includes("@radix-ui") || id.includes("lucide-react")) return "ui-vendor";
            return "vendor";
          },
        },
      },
    },
  };
});
