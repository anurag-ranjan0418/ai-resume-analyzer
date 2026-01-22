/**
 * @file app/routes/upload.tsx
 * @description Ingestion gateway for the ApexResume Neural Engine.
 * Handles multi-stage document processing: FS persistence, visual rendering, 
 * metadata structuring, and AI-driven feedback loops.
 */

import { type FormEvent, useState } from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID, cn } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

/**
 * Page Metadata
 * Optimized for SEO and system identification.
 */
export const meta = () => ([
    { title: 'ApexResume | Initialize Resume Analysis' },
    { name: 'description', content: 'Upload your resume for neural AI-powered analysis' },
])

const Upload = () => {
    /** * SDK Hooks 
     * Accesses Puter's cloud filesystem (fs), intelligence (ai), and storage (kv).
     */
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    
    /** Processing States */
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    /**
     * Buffer Selection Handler
     * Captures the local file reference from the FileUploader child component.
     */
    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    /**
     * Audit Orchestrator
     * Executes the sequential pipeline required for a full neural audit.
     * 1. Persistence: Uploads raw PDF to Puter FS.
     * 2. Rendering: Converts PDF to Image for visual context.
     * 3. Metadata: Structures Job Specs and FS paths into KV storage.
     * 4. Evaluation: Invokes the AI feedback loop.
     */
    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);
        
        // Stage 1: File Persistence
        setStatusText('SYNCING_DOCUMENT_CACHE...');
        const uploadedFile = await fs.upload([file]);
        if (!uploadedFile) return setStatusText('CRITICAL_ERROR: UPLOAD_FAILED');

        // Stage 2: Visual Rasterization
        setStatusText('GENERATING_VISUAL_REPRESENTATION...');
        const imageFile = await convertPdfToImage(file);
        if (!imageFile.file) return setStatusText('CRITICAL_ERROR: RENDER_FAILED');

        // Stage 3: Image Transmission
        setStatusText('TRANSMITTING_ENCRYPTED_PACKETS...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('CRITICAL_ERROR: TRANSMISSION_FAILED');

        // Stage 4: Metadata Structuring
        setStatusText('STRUCTURING_NEURAL_METADATA...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        // Stage 5: AI Logic Execution
        setStatusText('AI_EVALUATION_IN_PROGRESS...');
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('CRITICAL_ERROR: AI_TIMEOUT');

        /** Parsing AI Response Stream */
        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        // Finalize state and persist feedback
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        
        setStatusText('DECRYPTING_RESULTS...');
        navigate(`/resume/${uuid}`);
    }

    /**
     * Submission Handler
     * Extracts form data and triggers the analysis pipeline.
     */
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;
        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
            {/* Background Grid Pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            
            <Navbar />

            <section className="relative z-10 max-w-6xl mx-auto px-8 pt-24 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* SYSTEM INFO: Operational status and phase tracking */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
                                <div className="w-6 h-[2px] bg-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-600">Phase_01</span>
                            </div>
                            <h1 className="text-6xl font-black text-slate-950 tracking-tighter leading-[0.85] uppercase animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 fill-mode-both">
                                Neural <br /> <span className="text-slate-200">Analysis_</span>
                            </h1>
                        </div>

                        <div className="p-6 bg-slate-50/50 backdrop-blur-md rounded-[2rem] border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-700 delay-300 fill-mode-both">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Status</span>
                                <div className={cn("w-2 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]", isProcessing ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-widest font-mono">
                                {isProcessing ? `> ${statusText}` : "> SYSTEM_READY"}
                            </p>
                        </div>
                    </div>

                    {/* UPLOAD FORM: Data entry and file dropzone */}
                    <div className="lg:col-span-8">
                        <div className="relative bg-white rounded-[2.5rem] p-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 fill-mode-both">
                            
                            {/* Scanning Progress Line */}
                            {isProcessing && (
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_20px_#10b981] z-50 animate-scan pointer-events-none" />
                            )}

                            {isProcessing ? (
                                <div className="flex flex-col items-center justify-center py-24 px-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-2 border-slate-50 rounded-full animate-spin border-t-emerald-500 duration-[2000ms]" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-white text-[8px] font-black rotate-12 shadow-2xl">PUTER</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-black text-slate-950 uppercase tracking-tighter">Deconstructing Payload</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing AI ...</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FieldGroup label="Company" id="company-name" placeholder="e.g. Google" />
                                        <FieldGroup label="Role" id="job-title" placeholder="e.g. Lead Designer" />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Description</label>
                                        <textarea 
                                            name="job-description"
                                            rows={4}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-sm placeholder:text-slate-300 resize-none shadow-inner"
                                            placeholder="Paste the job description here..."
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Document Payload</label>
                                        <div className="p-1 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-emerald-500 transition-all group">
                                            <FileUploader onFileSelect={handleFileSelect} />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-6 bg-slate-950 text-white rounded-[1.5rem] font-black text-[9px] uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all hover:shadow-[0_15px_30px_rgba(16,185,129,0.2)] active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-300"
                                        disabled={!file}
                                    >
                                        Execute Analysis
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

/**
 * Reusable Input Component
 * Standardized for the Neural Ingest UI theme.
 */
const FieldGroup = ({ label, id, placeholder }: { label: string, id: string, placeholder: string }) => (
    <div className="flex flex-col gap-3">
        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1" htmlFor={id}>{label}</label>
        <input 
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-sm placeholder:text-slate-300 shadow-inner" 
            type="text" 
            name={id} 
            placeholder={placeholder} 
            id={id} 
            required 
        />
    </div>
);

export default Upload;