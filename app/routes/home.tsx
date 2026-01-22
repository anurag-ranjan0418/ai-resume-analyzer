/**
 * @file app/routes/_index.tsx
 * @description The ApexResume Suite Dashboard.
 * Serves as the primary entry point for authenticated users, providing 
 * a high-level overview of all processed "Neural Audits" stored in Puter KV.
 */

import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";

export const meta = () => ([
    { title: 'ApexResume | Dashboard' },
    { name: 'description', content: 'Secured Archive' },
])

export default function Home() {
  /** Puter SDK & Global State */
  const { auth, kv, isLoading: authLoading } = usePuterStore();
  const navigate = useNavigate();

  /** Local Inventory State */
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  /**
   * Access Guard
   * Protects the dashboard by redirecting unauthenticated traffic.
   */
  useEffect(() => {
    if (!authLoading && !auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated, authLoading, navigate]);

  /**
   * Neural Sync Effect
   * Batch fetches all keys matching the 'resume:*' pattern from Puter KV.
   * Maps the raw string values back into structured JSON objects for the grid.
   */
  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        // Fetch all items with 'resume:' prefix
        const items = (await kv.list('resume:*', true)) as any[];
        
        // Parse raw string values into objects
        const parsedResumes = items?.map((item) => JSON.parse(item.value));
        setResumes(parsedResumes || []);
      } catch (error) {
        console.error("Neural Sync Error:", error);
      } finally {
        setLoadingResumes(false);
      }
    };

    if (auth.isAuthenticated) loadResumes();
  }, [kv, auth.isAuthenticated]);

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white">
      {/* Structural Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none opacity-40" />
      
      <Navbar />

      <section className="relative z-10 max-w-[1600px] mx-auto px-12 pt-16 pb-20">
        
        {/* DASHBOARD HEADER: Inventory stats and Branding */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-slate-950" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Secured Archive</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-950 tracking-tighter leading-[0.8] uppercase">
              Resume <br /> 
              <span className="text-slate-200">Inventory_</span>
            </h1>
          </div>
          
          {/* Capacity Card: Displays count of items retrieved from KV */}
          <div className="bg-slate-950 p-6 rounded-2xl text-white min-w-[240px] shadow-xl shadow-slate-200">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-0.5">System Capacity</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{resumes.length}</span>
              <span className="text-slate-500 font-bold text-[16px]">/ 30</span>
            </div>
          </div>
        </header>

        {/* DATA SYNCHRONIZATION: Active retrieval spinner */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-16">
             <div className="w-10 h-10 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
             <p className="mt-6 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing...</p>
          </div>
        )}

        {/* RESUMES GRID: Dynamic list of previous audits */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {resumes.map((resume, idx) => (
              <div 
                key={resume.id} 
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <ResumeCard resume={resume} />
              </div>
            ))}
          </div>
        )}

        {/* NULL STATE: Displayed when KV returns empty list */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border border-slate-100 rounded-[3rem] bg-slate-50/20">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">No Documents Found</h3>
            <Link 
              to="/upload" 
              className="px-12 py-6 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200"
            >
              Upload Document
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}