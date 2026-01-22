import React from "react";
import { cn } from "~/lib/utils";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Warning Icon Container */}
          <div className="p-4 bg-red-50 rounded-2xl">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
              {description}
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 pt-4">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-lg shadow-red-200"
            >
              {isLoading ? "Executing..." : "Confirm Deletion"}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;