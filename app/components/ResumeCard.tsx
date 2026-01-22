/**
 * @file app/components/ResumeCard.tsx
 * @description Preview card for the Resume Inventory.
 * Responsibilities include fetching binary document data from Puter FS,
 * managing memory with Object URL lifecycles, and displaying high-level metrics.
 */

import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

/**
 * @interface Resume
 * Defines the structure of a saved resume analysis within Puter KV/FS.
 */
export interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string; // Path to the file in Puter.js FileSystem
    feedback: {
        overallScore: number;
    };
}

/**
 * @component ResumeCard
 * Logic: Bridge between Puter's cloud storage and the browser's <img> tag.
 * Uses `URL.createObjectURL` to convert a Puter blob into a viewable asset.
 */
const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    const { fs } = usePuterStore();
    const [resumeUrl, setResumeUrl] = useState<string>('');

    /**
     * Effect: Load Resume Binary Data
     * Retrieves the file from Puter FS and converts it to a browser-readable URL.
     * Includes a cleanup phase to prevent memory leaks in the browser.
     */
    useEffect(() => {
        let url = '';
        
        const loadResume = async () => {
            try {
                // Fetch blob from Puter Cloud Storage
                const blob = await fs.read(imagePath);
                if (!blob) return;
                
                // Convert blob to local memory URL
                url = URL.createObjectURL(blob);
                setResumeUrl(url);
            } catch (error) {
                console.error("Failed to load resume image from Puter FS:", error);
            }
        };

        loadResume();

        // Cleanup: Revoke the object URL to free up client-side memory
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [imagePath, fs]);

    return (
        <Link 
            to={`/resume/${id}`} 
            className="resume-card group animate-in fade-in duration-1000 block"
        >
            {/* Header Section: Context & Neural Metric */}
            <div className="resume-card-header flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2 max-w-[70%]">
                    {companyName ? (
                        <h2 className="text-xl text-slate-950 font-black tracking-tight break-words leading-tight uppercase">
                            {companyName}
                        </h2>
                    ) : (
                        <h2 className="text-xl text-slate-950 font-black tracking-tight uppercase">
                            Archived_Resume
                        </h2>
                    )}
                    
                    {jobTitle && (
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 break-words leading-none">
                            {jobTitle}
                        </h3>
                    )}
                </div>
                
                <div className="flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            {/* Preview Section: Visual representation of the document */}
            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-1000 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                    <div className="w-full h-full relative overflow-hidden">
                        <img
                            src={resumeUrl}
                            alt={`${companyName || 'Resume'} preview`}
                            className="w-full h-[350px] max-sm:h-[200px] object-cover object-top transition-all duration-700 group-hover:scale-105 group-hover:brightness-95"
                        />
                        {/* Glass Overlay on Hover */}
                        <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/5 transition-colors duration-500" />
                    </div>
                </div>
            )}
        </Link>
    );
};

ResumeCard.displayName = "ResumeCard";

export default ResumeCard;