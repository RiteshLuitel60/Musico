// Import necessary functions and plugins
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/ vite configuration
export default defineConfig({
  // Add plugins to the build process
  plugins: [react()],
});
