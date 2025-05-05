
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Only run HMR in development mode
  server: {
    host: "::",
    port: 8080,
    // Disable HMR WebSocket to prevent token issues
    hmr: mode === 'development' ? {
      clientPort: 8080,
    } : false,
    // Allow CORS for our domains
    allowedHosts: [
      'a9a7bf4a-ae3f-4df0-974c-fa630b8660fd.lovableproject.com',
      '.lovableproject.com'
    ]
  },
  // Use a different approach for environment variables
  // Instead of using __WS_TOKEN__, use a safer approach
  define: {
    // Avoid directly defining __WS_TOKEN__
    'process.env': JSON.stringify({
      NODE_ENV: mode,
      DEV: mode === 'development'
    })
  },
  plugins: [
    react(),
    // Only use componentTagger in development
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  // Add esbuild options to handle various syntax elements
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Optimize dependencies to ensure proper processing
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lovable-tagger']
  }
}));
