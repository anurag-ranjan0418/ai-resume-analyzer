/**
 * @file vite.config.ts
 * @description Core configuration for the Vite build tool.
 * This setup integrates React Router (v7/Remix-style), Tailwind CSS (v4), 
 * and TypeScript path aliasing for the ApexResume Neural Engine.
 */

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  /**
   * PLUGINS
   * * tailwindcss: Enables high-performance, build-time CSS processing.
   * reactRouter: Orchestrates the routing engine and server-side rendering logic.
   * tsconfigPaths: Maps '~/' aliases from tsconfig.json to actual directory paths.
   */
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths()
  ],
});