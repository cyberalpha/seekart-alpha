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
      // Simplified HMR configuration
      host: 'localhost',
      port: 8080,
      clientPort: 8080,
    },
    // Keep allowed hosts configuration for CORS issues
    allowedHosts: [
      'a9a7bf4a-ae3f-4df0-974c-fa630b8660fd.lovableproject.com',
      '.lovableproject.com'
    ]
  },
  define: {
    // Use JSON.stringify for all environment variables to ensure proper escaping
    __WS_TOKEN__: JSON.stringify('development-token'),
    // Empty process.env object to prevent undefined errors
    'process.env': JSON.stringify({})
  },
  plugins: [
    react(),
    // Only include componentTagger in development mode
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add specific build options to handle environment variables better
  build: {
    sourcemap: true,
    // Ensure proper handling of dynamic imports
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
