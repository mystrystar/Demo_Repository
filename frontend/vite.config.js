import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy API calls to the backend so the browser never needs the API key or CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:3001" },
  },
});
