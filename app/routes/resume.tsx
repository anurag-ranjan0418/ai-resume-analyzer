/**
 * @file app/routes/resume.$id.tsx
 * @description The Neural Audit Review interface. 
 * Reconstitutes document assets from Puter FS and metadata from Puter KV 
 * to present a side-by-side analysis of the resume and AI feedback.
 */

import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => ([
    { title: 'ApexResume | Review' },
    { name: 'description', content: 'Review Your Insights' },
])

const Resume = () => {
    /** Puter SDK & Routing */
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const navigate = useNavigate();

    /** Asset States */
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    /**
     * Auth Guard
     * Redirects unauthenticated users to the login flow while preserving the return path.
     */
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    /**
     * Asset Reconstitution Effect
     * 1. Fetches structured data from Puter KV via the UUID.
     * 2. Reads raw binary data from Puter FS.
     * 3. Transforms blobs into local Object URLs for browser rendering.
     */
    useEffect(() => {
        const loadResume = async () => {
            // Retrieve session metadata
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;

            const data = JSON.parse(resume);

            // Reconstitute PDF Document
            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;
            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            // Reconstitute Rasterized Preview
            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            // Set AI Analysis result
            setFeedback(data.feedback);
        }

        loadResume();

        // Cleanup: Ideally, Object URLs should be revoked here in a production environment
        // return () => { URL.revokeObjectURL(resumeUrl); URL.revokeObjectURL(imageUrl); }
    }, [id]);

    return (
        <main className="fixed inset-0 z-[100] bg-white overflow-y-auto font-sans selection:bg-slate-900 selection:text-white">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/images/bg-main.svg')] bg-cover opacity-30 pointer-events-none -z-10" />

            {/* Global Navigation */}
            <nav className="sticky top-0 z-50 w-full px-8 py-4 backdrop-blur-xl bg-white/60 border-b border-slate-100 flex items-center justify-between">
                <Link to="/" className="group flex items-center gap-3">
                    <div className="p-2 rounded-full bg-slate-950 text-white transition-transform group-hover:-translate-x-1">
                        <img src="/icons/back.svg" alt="back" className="w-3 h-3 invert" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">Suite Dashboard</span>
                </Link>

                <div className="flex items-center gap-3">
                    <Link 
                        to="/" 
                        className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-black text-[10px] uppercase tracking-[0.2em] text-white bg-slate-950 rounded-xl group transition-all active:scale-95"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-emerald-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
                        <span className="relative">Dashboard</span>
                    </Link>

                    <Link 
                        to="/upload" 
                        className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-black text-[10px] uppercase tracking-[0.2em] text-white bg-slate-950 rounded-xl group transition-all active:scale-95"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-emerald-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
                        <span className="relative">Upload</span>
                    </Link>
                </div>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse min-h-[calc(100vh-85px)]">
                {/* LEFT: Document Preview Layer */}
                <section className="w-1/2 max-lg:w-full p-8 lg:p-12 flex items-start justify-center bg-slate-50/40 backdrop-blur-sm border-r border-slate-100">
                    <div className="sticky top-32 w-full max-w-xl animate-fade-up">
                        {imageUrl && resumeUrl ? (
                            <div className="relative group transition-all duration-500 hover:scale-[1.01]">
                                <div className="absolute -inset-4 bg-slate-950/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="relative block border border-slate-200 rounded-2xl overflow-hidden shadow-2xl bg-white">
                                    <img src={imageUrl} className="w-full h-auto object-contain" alt="Resume Preview" />
                                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/5 transition-colors flex items-center justify-center">
                                        <span className="bg-white/90 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                                            Open Full PDF
                                        </span>
                                    </div>
                                </a>
                            </div>
                        ) : (
                            /* Visual Loading State */
                            <div className="aspect-[3/4] w-full bg-slate-100/50 rounded-2xl animate-pulse flex items-center justify-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Visuals...</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* RIGHT: Intelligence & Feedback Layer */}
                <section className="w-1/2 max-lg:w-full p-12 lg:p-24 bg-white/80">
                    <header className="mb-20 animate-fade-up">
                        <h2 className="text-6xl font-black text-slate-950 tracking-tighter uppercase leading-[0.85]">
                            Resume <br /> Review
                        </h2>
                        <div className="h-px w-20 bg-slate-950 mt-8" />
                        <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">
                            System Intelligence Analysis
                        </p>
                    </header>

                    {feedback ? (
                        /* Rendered Analysis Modules */
                        <div className="flex flex-col gap-16 animate-fade-up [animation-delay:0.2s]">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        /* Analysis Synthesis State */
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <img src="/images/resume-scan-2.gif" className="w-64 mix-blend-multiply grayscale opacity-80" />
                            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">
                                Synthesizing Metrics
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume;