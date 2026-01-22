/**
 * @file app/components/ScoreCircle.tsx
 * @description A high-precision circular progress indicator.
 * Leverages the SVG stroke-dash properties to visualize scores. Unlike the 
 * semi-circular gauge, this provides a full 360-degree context for data.
 */

import React from "react";

interface ScoreCircleProps {
    /** The numerical score (0-100) to display as a progress ring */
    score?: number;
}

/**
 * @component ScoreCircle
 * Logic: Uses the circumference formula (C = 2πr) to map a 0-100 score 
 * to a dashoffset value, creating the "drawing" effect of the progress ring.
 */
const ScoreCircle: React.FC<ScoreCircleProps> = ({ score = 75 }) => {
    // Layout Constants
    const radius = 40;
    const stroke = 6; // Thin stroke for a "precision instrument" aesthetic
    const normalizedRadius = radius - stroke / 2;
    
    // Geometry Logic: Calculate the total length of the path
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = score / 100;
    
    /**
     * Offset Logic:
     * circumference * 1 = Ring is empty (offset 100%)
     * circumference * 0 = Ring is full (offset 0%)
     */
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div 
            className="relative w-24 h-24" 
            role="progressbar" 
            aria-valuenow={score} 
            aria-valuemin={0} 
            aria-valuemax={100}
        >
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90 transition-transform duration-500"
            >
                {/* Background Track Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="#f1f5f9" // Slate-100 to match the APEX UI system
                    strokeWidth={stroke}
                    fill="transparent"
                />

                {/* Gradient Definition: Emerald (Success) to Slate (Tech) */}
                <defs>
                    <linearGradient id="scoreGrad" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" /> 
                        <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                </defs>

                {/* Animated Progress Circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="url(#scoreGrad)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    style={{ 
                        strokeDashoffset,
                        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }}
                    strokeLinecap="round"
                />
            </svg>

            {/* Centered Readout Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-black text-xs text-slate-950 tracking-tighter">
                    {score}
                    <span className="text-[8px] text-slate-400 ml-0.5 font-bold uppercase tracking-tighter">
                        pts
                    </span>
                </span>
            </div>
        </div>
    );
};

ScoreCircle.displayName = "ScoreCircleProgress";

export default ScoreCircle;