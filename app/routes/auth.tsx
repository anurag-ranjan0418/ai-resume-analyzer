/**
 * @file app/routes/auth.tsx
 * @description Neural Authentication Gateway for ApexResume.
 * Leverages Puter.js for cloud-native authentication, allowing users to
 * securely persist their resume audits to their personal Puter Cloud FS/KV.
 */

import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router";

export const meta = () => ([
    { title: 'ApexResume | Access Terminal' },
    { name: 'description', content: 'Neural Authentication Gateway' },
])

const Auth = () => {
    /** SDK & Routing Hooks */
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    
    // Captures the intended destination after login (e.g., /resume/uuid)
    const next = location.search.split('next=')[1] || "/";

    return (
        <main className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center font-sans overflow-hidden">
            
            {/* AMBIENT BACKGROUND: Foggy gradients for reduced cognitive load */}
            <div className="absolute inset-0 z-0 opacity-60">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-slate-200/50 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-200/40 rounded-full blur-[100px] [animation-duration:10s] animate-pulse" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            {/* SYSTEM STATUS NODES: Decorative terminal-style labels */}
            <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
                <StatusNode position="top-[15%] left-[10%]" label="System" value="Stable_01" delay="delay-100" />
                <StatusNode position="bottom-[20%] left-[15%]" label="Region" value="Cloud_Node" delay="delay-500" />
                <StatusNode position="top-[25%] right-[12%]" label="Auth" value="Encrypted" delay="delay-300" />
            </div>

            <div className="relative z-20 w-full max-w-md px-8">
                {/* AUTH CARD */}
                <section className="relative bg-white/40 backdrop-blur-2xl rounded-[2.5rem] p-12 border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.02)] animate-in fade-in zoom-in-95 duration-1000">
                    
                    <div className="flex flex-col gap-10">
                        {/* Header Section */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/50">
                                <div className="w-1 h-1 rounded-full bg-slate-400" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Secure Access via Puter</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tighter leading-none animate-in slide-in-from-bottom-2 duration-700 delay-200">
                                APEX<span className="text-slate-300">_</span><br></br>Resume
                            </h1>
                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[200px]">
                                Harmonizing your professional data with neural insights.
                            </p>
                        </div>

                        {/* PUTER AUTH ACTIONS */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center gap-3 py-4">
                                    <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synchronizing...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {auth.isAuthenticated ? (
                                        <>
                                            <Link 
                                                to={next}
                                                className="group flex items-center justify-between px-8 py-5 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-900 active:scale-95 shadow-lg shadow-slate-200"
                                            >
                                                <span>Resume Session</span>
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>

                                            <button 
                                                className="py-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors" 
                                                onClick={auth.signOut}
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            className="group relative w-full py-6 bg-white border border-slate-200 rounded-2xl transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
                                            onClick={auth.signIn}
                                        >
                                            <span className="text-slate-700 font-black text-[10px] uppercase tracking-[0.3em]">Login via Puter</span>
                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Terminal-style Footer */}
                        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Core_v2.0</span>
                            <div className="flex items-center gap-4">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Encrypted</span>
                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Verified</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

/**
 * Visual background element for environmental data labels
 */
const StatusNode = ({ position, label, value, delay }: any) => (
    <div className={`absolute ${position} hidden md:flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-4 duration-1000 ${delay} fill-mode-both`}>
        <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.3em]">{label}</span>
        <span className="text-[10px] font-bold text-slate-400 tracking-tight">{value}</span>
    </div>
);

export default Auth;