/**
 * @file app/components/Summary.tsx
 * @description The high-level intelligence summary for the Resume Audit.
 * Features a central ScoreGauge and a breakdown of categorized metrics 
 * (Tone, Content, Structure, Skills) retrieved from the AI analysis.
 */

import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import { cn } from "~/lib/utils";

interface CategoryProps {
  title: string;
  score: number;
}

/**
 * @component Category
 * Renders an individual metric row with dynamic color-coding based on the score.
 */
const Category = ({ title, score }: CategoryProps) => {
  // Dynamic color logic for visual priority
  const textColor = 
    score > 70 ? 'text-emerald-600' : 
    score > 49 ? 'text-amber-600' : 
    'text-rose-600';

  return (
    <div className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors duration-300">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-950 transition-colors">
                {title}
            </p>
            <ScoreBadge score={score} />
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-black tracking-tighter text-slate-950">
            <span className={cn(textColor)}>{score}</span>
            <span className="text-slate-200 font-normal ml-1">/100</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * @component Summary
 * The primary hero card for the Review route.
 */
const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] w-full overflow-hidden animate-fade-up">
      
      {/* HERO: The primary Overall Score visualization */}
      <div className="flex flex-col md:flex-row items-center p-10 gap-10 bg-slate-50/50 border-b border-slate-100">
        <div className="shrink-0 scale-110 drop-shadow-xl">
          <ScoreGauge score={feedback.overallScore} />
        </div>

        <div className="flex flex-col gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none">
                System <br /> Assessment
            </h2>
            <div className="h-1 w-12 bg-slate-950 mt-4 rounded-full" />
          </div>
          
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose max-w-xs">
            Synthesized metric based on ATS compatibility and document architecture variables.
          </p>
        </div>
      </div>

      {/* BREAKDOWN: Sub-category performance metrics */}
      <div className="bg-white">
        <div className="px-8 pt-8 pb-2">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Section breakdown</p>
        </div>
        <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
        <Category title="Content Quality" score={feedback.content.score} />
        <Category title="Structure & Layout" score={feedback.structure.score} />
        <Category title="Skills Alignment" score={feedback.skills.score} />
      </div>

      {/* Decorative footer element */}
      <div className="h-2 bg-gradient-to-r from-transparent via-slate-100 to-transparent mb-4" />
    </div>
  );
};

Summary.displayName = "ResumeSummaryCard";

export default Summary;