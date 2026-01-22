import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

/**
 * Navbar Component
 * The primary navigation hub for ApexResume.
 * Includes real-time network monitoring to prevent sync errors during uploads.
 */
const Navbar = () => {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(true);

  // Network Sentry: Monitors browser connectivity status
  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    // Event listeners for real-time network shifts
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);
  
  // Helper to determine active route styling
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100] transition-all duration-300" 
      role="navigation" 
      aria-label="Main Navigation"
    >
      <div className="container max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Branding Section: Logo and Versioning */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group transition-transform active:scale-95"
          aria-label="ApexResume Home"
        >
          <div className="relative">
            <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xl shadow-slate-200 group-hover:rotate-[10deg] transition-transform duration-300">
              A
            </div>
            
            {/* Live Status Indicator: Emerald = Connected, Red = Offline */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center">
              <div className={cn(
                "w-2 h-2 rounded-full transition-colors duration-500",
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-600 shadow-[0_0_5px_red]"
              )} />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tighter text-slate-950 leading-none">
              APEX<span className="text-emerald-600">RESUME</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Neural_Engine v2
            </span>
          </div>
        </Link>

        {/* Center Navigation: Core Engine Routes */}
        <div className="hidden md:flex items-center bg-slate-50 p-1 rounded-lg border border-slate-100">
          <NavLink to="/" active={isActive("/")} label="Terminal" />
          <NavLink to="/upload" active={isActive("/upload")} label="Analyze" />
          <NavLink to="/wipe" active={isActive("/wipe")} label="Clean" />
        </div>

        {/* Action Zone: Connection Badges & CTA */}
        <div className="flex items-center gap-4 lg:gap-6">
          
          {/* Detailed Connection Badge */}
          <div className={cn(
            "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-500",
            isOnline 
              ? "bg-slate-50 border-slate-100" 
              : "bg-red-50 border-red-200 animate-pulse"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isOnline ? "bg-emerald-500" : "bg-red-600"
            )} />
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.2em] font-mono",
              isOnline ? "text-slate-500" : "text-red-700"
            )}>
              {isOnline ? "Link_Stable" : "Link_Severed"}
            </span>
          </div>

          <Link 
            to="/auth" 
            className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors hidden lg:block"
          >
            Account
          </Link>

          {/* Primary CTA: Disabled automatically when offline */}
          <Link 
            to="/upload" 
            className={cn(
              "relative inline-flex items-center justify-center px-5 py-2.5 overflow-hidden font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all rounded-xl group",
              isOnline ? "bg-slate-950" : "bg-slate-200 cursor-not-allowed"
            )}
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-emerald-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
            <span className="relative">{isOnline ? "Upload Document" : "System Offline"}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

/**
 * NavLink Utility
 * Specialized link component for consistent button-style navigation.
 */
const NavLink = ({ to, active, label }: { to: string; active: boolean; label: string }) => (
  <Link
    to={to}
    className={cn(
      "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-md",
      active 
        ? "bg-white text-slate-950 shadow-sm border border-slate-200" 
        : "text-slate-400 hover:text-slate-600"
    )}
  >
    {label}
  </Link>
);

export default Navbar;