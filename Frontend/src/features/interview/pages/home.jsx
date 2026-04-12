import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router'; 
import { Upload, Briefcase, User, Sparkles, FileText, CheckCircle2, Loader2 } from 'lucide-react';

// IMPORT YOUR CUSTOM HOOK
import { useInterview } from '../hooks/useInterview'; 

const Home = () => {
    // 1. Hook Integrations
    const navigate = useNavigate();
    const { loading, generateReport } = useInterview();

    // 2. Local State for Inputs
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [fileName, setFileName] = useState('');
    const resumeInputRef = useRef(null);

    // 3. Handle File Selection
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    // 4. Handle Form Submission
    const handleGenerateClick = async () => {
        const file = resumeInputRef.current?.files[0];

        if (!jobDescription || (!file && !selfDescription)) {
            return; 
        }

        // THE FIX: Change variable name to understand it's a massive object, not just an ID
        const newReportData = await generateReport(jobDescription, selfDescription, file);

        // THE FIX: Dig into the object and extract specifically the '_id' string
        if (newReportData && newReportData._id) {
            navigate(`/interview/${newReportData._id}`);
        }
    };

    return (
        <main className="min-h-screen bg-[#060B19] text-slate-200 font-sans p-4 sm:p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden selection:bg-blue-500/30">
            
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-5xl relative z-10 space-y-8">
                
                <div className="text-center space-y-3">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                        AI Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Architect</span>
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                        Upload your engineering profile and target job description. Our engine will synthesize a targeted preparation roadmap.
                    </p>
                </div>

                <div className="bg-[#0E1526]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
                        
                        {/* LEFT COLUMN: Job Description */}
                        <div className="flex flex-col h-full bg-[#0A101D]/50">
                            <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-800/80">
                                <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                                        <Briefcase size={16} />
                                    </div>
                                    Target Role Requirements
                                </h2>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">Required</span>
                            </div>
                            <div className="p-5 sm:p-6 flex-grow">
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the complete job description here...&#10;&#10;e.g., 'Looking for a Backend Developer with 3+ years of Node.js experience, strong system design skills...'"
                                    className="w-full h-48 lg:h-full lg:min-h-[280px] bg-transparent text-sm text-slate-300 placeholder:text-slate-600 border-0 focus:ring-0 resize-none p-0 custom-scrollbar leading-relaxed outline-none"
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Profile */}
                        <div className="flex flex-col h-full">
                            <div className="p-5 sm:p-6 flex items-center gap-2 border-b border-slate-800/80">
                                <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
                                    <User size={16} />
                                </div>
                                <h2 className="text-sm font-semibold text-slate-200">Candidate Profile</h2>
                            </div>
                            
                            <div className="p-5 sm:p-6 space-y-6 flex-grow flex flex-col justify-between">
                                
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Input</label>
                                    
                                    <div 
                                        onClick={() => resumeInputRef.current?.click()}
                                        className={`group flex flex-col items-center justify-center w-full h-28 bg-[#0A101D] border border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${fileName ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5'}`}
                                    >
                                        {fileName ? (
                                            <>
                                                <CheckCircle2 size={24} className="mb-2 text-blue-400" />
                                                <p className="text-sm font-medium text-slate-200">{fileName}</p>
                                                <p className="text-xs text-slate-500 mt-1">Click to replace PDF</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={22} className="mb-2 text-slate-500 group-hover:text-blue-400 transition-colors" strokeWidth={1.5} />
                                                <p className="text-sm font-medium text-slate-400 group-hover:text-blue-300 transition-colors">
                                                    Upload Resume (PDF)
                                                </p>
                                                <p className="text-xs text-slate-600 mt-1">Max file size: 5MB</p>
                                            </>
                                        )}
                                    </div>
                                    
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        hidden 
                                        ref={resumeInputRef} 
                                        onChange={handleFileChange} 
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex-grow h-px bg-slate-800"></div>
                                    <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">Or Add Context</span>
                                    <div className="flex-grow h-px bg-slate-800"></div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Summary</label>
                                    <textarea
                                        value={selfDescription}
                                        onChange={(e) => setSelfDescription(e.target.value)}
                                        placeholder="Briefly describe your core stack, years of experience, and key projects..."
                                        className="w-full h-24 bg-[#0A101D] border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none leading-relaxed outline-none"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER / ACTION BAR --- */}
                    <div className="bg-[#0A101D] p-5 sm:p-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-5">
                        <div className="flex items-start gap-3 text-slate-500 w-full sm:w-auto">
                            <FileText size={18} className="shrink-0 text-slate-600 mt-0.5" />
                            <p className="text-xs leading-relaxed max-w-xs">
                                For the most accurate AI generation, providing both a resume and a job description is recommended.
                            </p>
                        </div>
                        
                        <button 
                            onClick={handleGenerateClick}
                            disabled={loading || !jobDescription || (!fileName && !selfDescription)}
                            className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white px-8 py-3.5 text-sm font-bold transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-blue-200" />
                                    <span>Forging Strategy...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} className="text-blue-200" />
                                    <span>Generate Roadmap</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default Home;