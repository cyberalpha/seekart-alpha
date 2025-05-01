
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Add explicit HMR configuration
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
      clientPort: 8080, // Ensure client and server use same port
      overlay: true, // Enable error overlay
    },
  },
  define: {
    // Define the missing __WS_TOKEN__ variable
    __WS_TOKEN__: JSON.stringify("development-token"),
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
