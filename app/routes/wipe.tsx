/**
 * @file app/routes/wipe.tsx
 * @description Administrative dashboard for ApexResume. 
 * Handles deep-cleaning of the Puter.js file system and KV metadata stores.
 */

import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { cn } from "~/lib/utils";
import Navbar from "~/components/Navbar";

/**
 * @component ConfirmDialog
 * @description A high-fidelity, themed modal used to intercept destructive actions.
 * Employs Framer-like Tailwind animations for the backdrop and entry scaling.
 */
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  isLoading 
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Visual Overlay: Backdrop with Gaussian blur for focus depth */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      {/* Modal Container: Optimized for high-contrast visibility */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Status Icon: Red-themed warning glyph */}
          <div className="p-4 bg-red-50 rounded-2xl">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Text Content: Structured for immediate risk assessment */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-[0.2em]">
              {description}
            </p>
          </div>

          {/* Action Callbacks: High-contrast buttons with state handling */}
          <div className="flex flex-col w-full gap-3 pt-4">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-xl shadow-red-200"
            >
              {isLoading ? "Executing_Purge..." : "Confirm Deletion"}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all"
            >
              Abort Mission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * @view WipeApp
 * @description The main administration route. Orchestrates the handshake between 
 * Puter's cloud services (FS/KV) and the user interface.
 */
const WipeApp = () => {
    /** Puter Store: Consumes global state for filesystem and auth context */
    const { auth, isLoading, fs, kv } = usePuterStore();
    const navigate = useNavigate();
    
    /** Local State: Tracks manifest list and modal visibility */
    const [files, setFiles] = useState<any[]>([]);
    const [isWiping, setIsWiping] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    /**
     * @method loadFiles
     * @description Fetches a real-time list of objects from the Puter root directory.
     */
    const loadFiles = async () => {
        try {
            const items = await fs.readDir("./");
            setFiles(items || []);
        } catch (e) {
            console.error("Manifest Load Error:", e);
        }
    };

    /**
     * @hook useEffect
     * @description Gatekeeper logic. Redirects non-authenticated users and 
     * triggers the manifest loader once Puter is ready.
     */
    useEffect(() => {
        if (!isLoading && auth.isAuthenticated) {
            loadFiles();
        } else if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading, auth.isAuthenticated]);

    /**
     * @method handleExecuteWipe
     * @description Destructive Orchestrator. 
     * 1. Maps over files for parallel deletion.
     * 2. Flushes the Key-Value store for metadata reset.
     * 3. Re-syncs the UI state.
     */
    const handleExecuteWipe = async () => {
        setIsWiping(true);
        try {
            // Initiate parallel deletion of cloud filesystem assets
            await Promise.all(files.map((file) => fs.delete(file.path)));
            
            // Wipe the persistent metadata associated with this domain
            await kv.flush();
            
            // Re-sync local manifest to confirm empty state
            await loadFiles();
            setIsDialogOpen(false);
        } catch (e) {
            console.error("System Wipe Failed:", e);
        } finally {
            setIsWiping(false);
        }
    };

    /** Initial SDK Handshake State */
    if (isLoading) return (
        <div className="min-h-screen bg-white flex items-center justify-center font-black tracking-[0.3em] text-slate-300 animate-pulse">
            SYSTEM_SYNC...
        </div>
    );

    return (
        <>
            <Navbar />

            {/* Custom Dialog: Invoked only upon 'Execute Wipe' trigger */}
            <ConfirmDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleExecuteWipe}
                title="Critical Reset"
                description="You are about to permanently destroy all cloud assets and metadata."
                isLoading={isWiping}
            />

            <main className="min-h-screen bg-white pt-48 pb-24 px-8 lg:px-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12 animate-fade-up">
                    
                    {/* ASIDE: System Status & Identity */}
                    <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-48 h-fit">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase leading-[0.9]">
                                System <br /> Control
                            </h1>
                            <div className="h-1 w-12 bg-emerald-500 rounded-full" />
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
                                Managed data environment for <br />
                                <span className="text-slate-950">ApexResume Intelligence</span>
                            </p>
                        </div>

                        {/* Identity Card: Authenticated Puter User Info */}
                        <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active_Operator</span>
                                <p className="text-lg font-black text-slate-950 tracking-tight">@{auth.user?.username}</p>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </div>
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Puter_Authenticated</span>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN: Cloud Storage Manifest Table */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Storage_Manifest</h2>
                                <span className="text-[10px] font-mono text-slate-300 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                    {files.length} Objects
                                </span>
                            </div>

                            <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 overflow-hidden backdrop-blur-sm shadow-inner">
                                {files.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {files.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-6 bg-white/40 hover:bg-white transition-all duration-300 group">
                                                <div className="flex items-center gap-5">
                                                    {/* File Entry Glyph */}
                                                    <div className="p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-700 tracking-tight">{file.name}</span>
                                                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tighter mt-0.5 opacity-60 group-hover:opacity-100">
                                                            REF: {file.path}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Empty State Fragment */
                                    <div className="py-32 text-center space-y-4">
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em]">Cache_Purged</p>
                                        <p className="text-[10px] text-slate-400 font-medium max-w-[200px] mx-auto uppercase tracking-tighter leading-relaxed">
                                            No local or cloud assets found in directory.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CRITICAL ZONE: Trigger for the destructive flow */}
                        <div className="group/wipe bg-slate-50/50 hover:bg-red-50/50 rounded-[2.5rem] p-10 border border-slate-100 hover:border-red-100/50 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500">
                            <div className="space-y-3 text-center md:text-left">
                                <div className="inline-flex px-3 py-1 bg-slate-200 text-slate-500 group-hover/wipe:bg-red-100 group-hover/wipe:text-red-700 rounded-full text-[8px] font-black uppercase tracking-widest transition-colors">
                                    Secure_Action
                                </div>
                                <h3 className="text-xl font-black text-slate-900 group-hover/wipe:text-red-950 uppercase tracking-tight transition-colors">
                                    Factory_Reset
                                </h3>
                                <p className="text-[11px] text-slate-400 group-hover/wipe:text-red-700/60 font-semibold max-w-sm leading-relaxed uppercase tracking-widest transition-colors">
                                    Purge all system assets and reset AI analysis metadata. This action is final.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsDialogOpen(true)}
                                disabled={isWiping || files.length === 0}
                                className={cn(
                                    "whitespace-nowrap px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 cursor-pointer",
                                    isWiping || files.length === 0
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-slate-900 text-white hover:bg-slate-800 group-hover/wipe:bg-red-600 group-hover/wipe:shadow-red-200/50 group-hover/wipe:shadow-xl"
                                )}
                            >
                                Execute Wipe
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default WipeApp;