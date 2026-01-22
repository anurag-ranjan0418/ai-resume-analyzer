/**
 * @file react-router.config.ts
 * @description Framework-level configuration for React Router (v7).
 * This file defines the global rendering strategy and engine behavior.
 */

import type { Config } from "@react-router/dev/config";

export default {
  /**
   * RENDER STRATEGY
   * ssr: true -> Enables Server-Side Rendering (Production standard).
   * * Note: To transition the Neural Engine into a Single Page Application (SPA),
   * set this to `false`. Current config ensures SEO optimization and 
   * faster initial document ingest for ApexResume.
   */
  ssr: true,
} satisfies Config;
