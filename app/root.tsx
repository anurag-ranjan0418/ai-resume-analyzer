/**
 * @file app/root.tsx
 * @description Root configuration and global layout for the ApexResume Neural Engine.
 * Manages Puter.js SDK orchestration, global metadata, and unified error handling.
 */

import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect, useRef } from "react";
import type { Route } from "./+types/root";

// Styles - Custom Theme & Tailwind V4
import "./app.css";

// State Management
import { usePuterStore } from "~/lib/puter";

// Layout Components
import Navbar from "~/components/Navbar";

/**
 * Global Links & Metadata
 * Standards: Optimizes LCP by pre-connecting to font providers and defining brand typography.
 */
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap",
  },
];

/**
 * Root Layout Component
 * Responsibility: Manages the base HTML document structure and handles Puter SDK lifecycle.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  const { init } = usePuterStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    /**
     * SDK Bootstrapping
     * Prevents double-initialization in React Strict Mode.
     */
    if (!hasInitialized.current) {
      init();
      hasInitialized.current = true;
    }

    /**
     * Hydration Signal
     * Removes loading class from document head once JS has captured the DOM.
     */
    document.documentElement.classList.remove("app-loading");
  }, [init]);

  return (
    <html lang="en" className="app-loading" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* Puter.js SDK - Loaded with defer to prioritize UI construction */}
        <script src="https://js.puter.com/v2/" defer />
      </head>
      <body className="font-sans antialiased bg-white text-slate-950 selection:bg-slate-900 selection:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Default Application Entry
 * Orchestrates the primary UI shell, including persistent navigation and content outlet.
 */
export default function App() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow focus:outline-none" id="main-content">
        <Outlet />
      </main>
    </div>
  );
}

/**
 * Global Error Boundary
 * Standards: High-fidelity error reporting for 404/500 states.
 * Logic: Includes the Navbar to maintain brand continuity during application failure.
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  // Type-safe error object resolution
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-white font-sans">
      {/* Persist primary navigation in error states */}
      <Navbar />

      <main className="relative flex min-h-0 flex-grow flex-col items-center justify-center p-6">
        {/* Decorative background depth */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white" />

        {/* Cinematic Watermark Text */}
        <div 
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden" 
          aria-hidden="true"
        >
          <span className="animate-pulse text-[30vw] font-black leading-none tracking-tighter text-slate-100/60">
            {message}
          </span>
        </div>

        <div className="container relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-12 lg:flex-row">
          {/* Descriptive Content */}
          <section className="flex flex-1 flex-col items-center space-y-8 text-center lg:items-start lg:text-left">
            <div className="space-y-4">
              <h1 className="animate-in fade-in slide-in-from-bottom-4 text-6xl font-black leading-[0.85] tracking-tight text-slate-950 duration-700 md:text-8xl">
                Lost in <br /> the data.
              </h1>
              <p className="delay-150 animate-in fade-in slide-in-from-bottom-4 max-w-md fill-mode-both pt-2 text-xl text-slate-500 duration-700">
                {details}
              </p>
            </div>

            <div className="delay-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
              <Link to="/" className="primary-button inline-flex w-auto px-10 shadow-xl">
                Return to Dashboard
              </Link>
            </div>
          </section>

          {/* Abstract Engine Visualization */}
          <VisualLogicSection message={message} />
        </div>

        {/* Developer Diagnostics (Environment Gated) */}
        {stack && (
          <aside className="absolute bottom-4 left-8 z-50 max-w-[90vw] md:max-w-xs">
            <pre className="max-h-[120px] overflow-auto rounded-xl border border-slate-800 bg-slate-950/90 p-3 text-[9px] text-slate-400 backdrop-blur-lg">
              <code>{stack}</code>
            </pre>
          </aside>
        )}
      </main>
    </div>
  );
}

/**
 * Sub-component for Error Page Visuals
 * Represents the architectural "gap" between Logic and Input.
 */
function VisualLogicSection({ message }: { message: string }) {
  return (
    <section 
      className="relative hidden h-[380px] w-[380px] flex-1 shrink-0 items-center justify-center lg:flex" 
      aria-hidden="true"
    >
      {/* Logic Sphere */}
      <div className="animate-bounce [animation-duration:4s] absolute left-0 flex h-64 w-64 items-center justify-center rounded-full border-2 border-slate-200 bg-white/40 p-8 text-center shadow-sm backdrop-blur-md">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Logic</span>
      </div>

      {/* Input Sphere (Offset animation timing) */}
      <div className="animate-bounce [animation-delay:-2s] [animation-duration:4s] absolute right-0 flex h-64 w-64 items-center justify-center rounded-full border-2 border-slate-200 bg-white/40 p-8 text-center shadow-sm backdrop-blur-md">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Input</span>
      </div>

      {/* Central Status Indicator */}
      <div className="absolute z-20 transition-transform duration-500 hover:scale-110">
        <div className="rounded-full border border-slate-800 bg-slate-950 px-6 py-2.5 text-[12px] font-black uppercase tracking-widest text-white shadow-2xl">
          {message} GAP
        </div>
      </div>
    </section>
  );
}