
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
    // Añadir hosts permitidos para solucionar el problema de "Blocked request"
    allowedHosts: [
      // Permitir el host específico mencionado en el error
      'a9a7bf4a-ae3f-4df0-974c-fa630b8660fd.lovableproject.com',
      // Permitir cualquier subdominio de lovableproject.com
      '.lovableproject.com'
    ]
  },
  define: {
    // Properly string encode all environment variables to prevent syntax errors
    __WS_TOKEN__: '"development-token"',
    'process.env': {}
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
