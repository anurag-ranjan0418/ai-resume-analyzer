/**
 * @file app/components/ScoreBadge.tsx
 * @description A semantic status indicator for audit scores.
 * Maps numerical performance data to human-readable labels and specific 
 * design tokens (Emerald/Amber/Slate) to provide immediate visual feedback.
 */

import React from "react";
import { cn } from "~/lib/utils";

/**
 * @interface ScoreBadgeProps
 * Contract for the ScoreBadge component.
 */
interface ScoreBadgeProps {
  /** The numerical audit score used to determine the visual theme and label */
  score: number;
}

/**
 * @component ScoreBadge
 * Renders a categorized status badge based on the provided score.
 * Employs React.useMemo to prevent unnecessary re-calculation of design tokens.
 */
const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  /**
   * Configuration Logic:
   * Maps score ranges to specific visual identities within the APEX theme.
   */
  const config = React.useMemo(() => {
    // High Performance: Emerald Theme
    if (score > 70) {
      return {
        label: "Strong Match",
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }
    // Average Performance: Amber Theme
    if (score > 49) {
      return {
        label: "Mid-Range",
        classes: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    // Critical/Low Performance: High-Contrast Dark Theme
    return {
      label: "Needs Logic",
      classes: "bg-slate-950 text-slate-400 border-slate-800",
    };
  }, [score]);

  return (
    <div
      className={cn(
        "px-4 py-1.5 rounded-md border text-center transition-all duration-300 shadow-sm inline-block",
        config.classes
      )}
      role="status"
      aria-label={`Analysis result: ${config.label}`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em]">
        {config.label}
      </p>
    </div>
  );
};

// Component Metadata
ScoreBadge.displayName = "ScoreStatusBadge";

export default ScoreBadge;