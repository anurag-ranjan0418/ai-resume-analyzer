/**
 * @file app/routes.ts
 * @description Centralized routing manifest for the ApexResume application.
 * Defines the mapping between URL segments and their respective route components.
 */

import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    /** Primary landing page and dashboard entry point */
    index("routes/home.tsx"),

    /** Authentication gateway for Puter environment login */
    route('/auth', 'routes/auth.tsx'),

    /** Resume ingestion and processing orchestration page */
    route('/upload', 'routes/upload.tsx'),

    /** Detailed analysis and AI feedback view for a specific resume instance */
    route('/resume/:id', 'routes/resume.tsx'),

    /** Utility route for cache clearing and environment reset */
    route('/wipe', 'routes/wipe.tsx'),
] satisfies RouteConfig;