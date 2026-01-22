import React from "react";
import { cn } from "~/lib/utils";

/**
 * Suggestion Logic Types
 * 'good' triggers emerald success markers.
 * 'improve' triggers amber warning markers for critical fixes.
 */
export type SuggestionType = "good" | "improve";

export interface Suggestion {
  type: SuggestionType;
  tip: string;
}

export interface ATSProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  suggestions: Suggestion[];
}

/**
 * ATS Component
 * Renders the primary performance metric for the Review page.
 * Logic: Employs a memoized configuration object to switch design tokens 
 * based on the numerical score provided by the PDFService.
 */
const ATS: React.FC<ATSProps> = ({ score, suggestions, className, ...props }) => {
  /**
   * Theme Configuration Logic
   * Maps numerical performance to specific visual identities (gradients, borders, icons).
   */
  const config = React.useMemo(() => {
    // High performance threshold
    if (score >= 70) {
      return {
        gradient: "from-emerald-50 to-white",
        border: "border-emerald-100",
        text: "text-emerald-900",
        icon: "/icons/ats-good.svg",
        subtitle: "Great Job!",
        accent: "text-emerald-600",
        badge: "bg-emerald-500",
      };
    }
    // Mid-range performance threshold
    if (score >= 50) {
      return {
        gradient: "from-amber-50 to-white",
        border: "border-amber-100",
        text: "text-amber-900",
        icon: "/icons/ats-warning.svg",
        subtitle: "Good Start",
        accent: "text-amber-600",
        badge: "bg-amber-500",
      };
    }
    // Low performance / critical threshold
    return {
      gradient: "from-slate-50 to-white",
      border: "border-slate-200",
      text: "text-slate-900",
      icon: "/icons/ats-bad.svg",
      subtitle: "Needs Improvement",
      accent: "text-rose-600",
      badge: "bg-rose-500",
    };
  }, [score]);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border p-8 shadow-sm transition-all",
        config.gradient,
        config.border,
        className
      )}
      {...props}
    >
      {/* Header: Score and Performance Label */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
          {/* Status Icon Container */}
          <div className="p-3 bg-white rounded-xl shadow-sm border border-white/50" aria-hidden="true">
            <img src={config.icon} alt="" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">
              ATS Performance
            </h2>
            <p className={cn("text-4xl font-black tracking-tighter", config.text)}>
              {score}
              <span className="text-slate-400 font-light text-2xl">/100</span>
            </p>
          </div>
        </div>

        {/* Desktop-only performance status badge */}
        <div className="hidden md:block">
          <span
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight bg-white border shadow-sm",
              config.accent
            )}
          >
            {config.subtitle}
          </span>
        </div>
      </header>

      {/* Content: Educational Context and Granular Suggestions */}
      <div className="space-y-6">
        <div className="max-w-2xl">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Analysis Overview</h3>
          <p className="text-sm leading-relaxed text-slate-500">
            This score quantifies how effectively your resume’s structure, keywords, and formatting
            align with standard{" "}
            <strong className="font-semibold text-slate-700">Applicant Tracking Systems</strong>.
          </p>
        </div>

        {/* Suggestion Loop: Maps AI insights into list items */}
        <ul className="grid gap-3" role="list">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.tip}-${index}`}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/40 border border-white/60 hover:bg-white/80 transition-all duration-200"
            >
              <div className="mt-1 shrink-0" aria-hidden="true">
                {suggestion.type === "good" ? (
                  // Success Icon (Emerald)
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  // Warning Icon (Amber)
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <span className="text-white text-[10px] font-black italic">!</span>
                  </div>
                )}
              </div>
              <p
                className={cn(
                  "text-sm font-medium leading-snug",
                  suggestion.type === "good" ? "text-slate-700" : "text-slate-800"
                )}
              >
                {suggestion.tip}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer: UI Branding for the Neural Engine */}
      <footer className="mt-8 pt-6 border-t border-slate-200/60">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse" aria-hidden="true" />
          Syncing with Recruiter Algorithms
        </p>
      </footer>
    </section>
  );
};

ATS.displayName = "ATSPerformance";

export default ATS;