/**
 * @file app/components/ScoreGauge.tsx
 * @description A high-end semi-circular progress gauge.
 * Uses SVG path measurement and stroke-dash mapping to create a 
 * mathematically accurate arc animation representing the audit score.
 */

import { useEffect, useRef, useState } from "react";

interface ScoreGaugeProps {
    /** The numerical score (0-100) to visualize */
    score?: number;
}

/**
 * @component ScoreGauge
 * Calculates the arc length dynamically to ensure the CSS transition 
 * exactly matches the path geometry regardless of browser scaling.
 */
const ScoreGauge = ({ score = 75 }: ScoreGaugeProps) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);

    // Normalize score to a 0-1 scale for dash-offset math
    const percentage = score / 100;

    /**
     * Path Measurement Effect
     * Runs after mount to measure the exact length of the SVG arc path.
     * Required for the 'strokeDashoffset' animation to be precise.
     */
    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    return (
        <div 
            className="flex flex-col items-center" 
            role="meter" 
            aria-valuenow={score} 
            aria-valuemin={0} 
            aria-valuemax={100}
        >
            <div className="relative w-40 h-24 overflow-hidden">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            {/* Apex Theme Gradient: Emerald (Success) to Slate (Tech) */}
                            <stop offset="0%" stopColor="#10b981" /> 
                            <stop offset="100%" stopColor="#64748b" />
                        </linearGradient>
                    </defs>

                    {/* Background track arc: Full 180° sweep */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#f1f5f9" // Slate-100 for subtle track visibility
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Foreground progress arc: Animated dash-offset */}
                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        style={{
                            strokeDashoffset: pathLength * (1 - percentage),
                            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    />
                </svg>

                {/* Central Score Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                    <div className="text-2xl font-black text-slate-950 tracking-tighter">
                        {score}
                        <span className="text-[10px] font-bold text-slate-400 ml-0.5 uppercase tracking-widest">
                            pts
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

ScoreGauge.displayName = "PerformanceGauge";

export default ScoreGauge;