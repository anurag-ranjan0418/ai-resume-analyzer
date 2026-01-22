import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize, cn } from "~/lib/utils";

interface FileUploaderProps {
    /** Callback triggered when a file is successfully staged or removed */
    onFileSelect?: (file: File | null) => void;
}

/**
 * FileUploader Component
 * Manages the PDF binary ingestion. Designed with high-contrast feedback 
 * for drag states and clear metadata display for the staged payload.
 */
const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    
    // Handler for processing files dropped into the terminal zone
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    // Maximum payload limit (20MB)
    const maxFileSize = 20 * 1024 * 1024;

    // React-dropzone configuration for PDF-only ingestion
    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    });

    const file = acceptedFiles[0] || null;

    return (
        <div className={cn(
            "w-full group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
            // Dynamic theme switching based on drag interaction
            isDragActive 
                ? "border-emerald-500 bg-emerald-50/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/50"
        )}>
            <div {...getRootProps()} className="p-10">
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        /* UI STATE: DOCUMENT STAGED
                         * Displays file metadata (name, size) and provides a removal action.
                         */
                        <div 
                            className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2" 
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center space-x-4">
                                {/* File Icon with Emerald accent */}
                                <div className="p-3 bg-slate-950 rounded-xl text-emerald-400 shadow-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-950 truncate max-w-[200px] tracking-tight">
                                        {file.name}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {formatSize(file.size)} • PDF DATA
                                    </p>
                                </div>
                            </div>
                            
                            {/* Remove File Button */}
                            <button 
                                type="button"
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileSelect?.(null);
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        /* UI STATE: STANDBY / PROMPT
                         * Visual instructions for the user to initiate document loading.
                         */
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <svg 
                                    className={cn("w-8 h-8 transition-colors", isDragActive ? "text-emerald-500" : "text-slate-400")} 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-slate-950 uppercase tracking-widest">
                                    {isDragActive ? "Injesting Data..." : "Load Resume"}
                                </p>
                                <p className="text-xs text-slate-500 font-medium">
                                    Drag & drop or <span className="text-emerald-600 font-bold">browse files</span>
                                </p>
                            </div>
                            {/* Constraint labeling for technical transparency */}
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">
                                MAX_PAYLOAD: {formatSize(maxFileSize)} PDF
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Visual Scanline Effect: Pure aesthetic decoration to mimic a neural scan */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:animate-scanline" />
        </div>
    );
};

export default FileUploader;