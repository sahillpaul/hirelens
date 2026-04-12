import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router'; 
import { Terminal, Users, Target, Map, Menu, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Loader2, Rocket } from 'lucide-react';

import { motion } from 'framer-motion'; 
import { useInterview } from '../hooks/useInterview'; 

const Interview = () => {
    const { interviewId } = useParams();
    const { report, loading, getReportById } = useInterview(); 

    const [activeTab, setActiveTab] = useState('skills');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

    const scrollContainerRef = useRef(null);

    // Clean reset to top on tab change
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [activeTab]);

    useEffect(() => {
        if (interviewId && !report) {
            getReportById(interviewId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId]);

    const toggleQuestion = (index) => {
        setOpenQuestionIndex(openQuestionIndex === index ? null : index);
    };

    if (loading || !report) {
        return (
            <div className="min-h-screen bg-[#060B19] flex flex-col items-center justify-center selection:bg-blue-500/30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                <Loader2 size={48} className="animate-spin text-blue-500 mb-6 relative z-10" />
                <h2 className="text-xl font-bold text-white relative z-10 tracking-wide">Decrypting Analysis...</h2>
                <p className="text-sm text-slate-400 mt-2 relative z-10">Fetching your tailored interview roadmap.</p>
            </div>
        );
    }

    const NavButton = ({ tabId, label, icon: Icon }) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => {
                    setActiveTab(tabId);
                    setOpenQuestionIndex(null); 
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                    isActive 
                    ? 'bg-blue-500/15 text-blue-400 font-medium border border-blue-500/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                }`}
            >
                <Icon size={18} />
                <span>{label}</span>
            </button>
        );
    };

    // --- TIMELINE MATH VARIABLES ---
    const TOTAL_DURATION = 4.0; // The golden ratio for a smooth, readable speed
    const TOTAL_PHASES = report?.preparationPlan?.length || 1;

    return (
        <main className="min-h-screen bg-[#060B19] text-slate-200 font-sans flex selection:bg-blue-500/30 overflow-hidden">
            
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed top-5 left-5 z-50 p-2 rounded-full hover:bg-slate-800/80 text-slate-300 transition-colors"
                aria-label="Toggle Sidebar"
            >
                <Menu size={22} />
            </button>

            <aside 
                className={`fixed inset-y-0 left-0 z-40 bg-[#0A101D] border-r border-slate-800/80 transform transition-transform duration-300 ease-in-out flex flex-col w-64 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="h-[72px] flex items-center pl-16 pr-6 border-b border-slate-800/80 shrink-0">
                    <h1 className="font-bold text-slate-100 tracking-tight text-lg">HireLens</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2">Analysis Hub</p>
                    <NavButton tabId="skills" label="Skill Gaps" icon={Target} />
                    <NavButton tabId="roadmap" label="Action Roadmap" icon={Map} />
                    <NavButton tabId="pow" label="Proof of Work" icon={Rocket} />
                    <NavButton tabId="technical" label="Technical Config" icon={Terminal} />
                    <NavButton tabId="behavioral" label="Behavioral Matrix" icon={Users} />
                </nav>
            </aside>

            <section 
                ref={scrollContainerRef}
                className={`flex-1 h-screen overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'md:ml-64' : 'ml-0'
                }`}
            >
                <div className="h-[72px] w-full border-b border-slate-800/80 flex items-center px-16 bg-[#060B19]/80 backdrop-blur-md sticky top-0 z-30">
                     <span className="text-sm font-medium text-slate-400 capitalize">
                         {activeTab === 'pow' ? 'Proof of Work Projects' : activeTab.replace('-', ' ')}
                     </span>
                </div>

                <div className="p-6 md:p-10 max-w-4xl mx-auto pb-12">
                    
                    <div className="mb-10 pb-6 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">Candidate Alignment</h2>
                            <p className="text-sm text-slate-400 mt-1">Algorithmic review of your profile against the target role.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-[#0A101D] border border-slate-700/80 rounded-xl px-5 py-3 shadow-lg">
                            <CheckCircle2 size={20} className="text-blue-500" />
                            <span className="text-sm font-medium text-slate-300">Match Score:</span>
                            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                {report?.matchScore || 0}%
                            </span>
                        </div>
                    </div>

                    <div className="animate-in fade-in duration-300">

                        {/* 1. SKILL GAPS */}
                        {activeTab === 'skills' && (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {report?.skillGaps?.map((gap, index) => (
                                    <div key={index} className="flex items-center justify-between p-5 rounded-xl border border-slate-800/80 bg-[#0E1526]">
                                        <span className="text-sm font-medium text-slate-200">{gap.skill}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                                            gap.severity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                            gap.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                            {gap.severity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. ROADMAP */}
                        {activeTab === 'roadmap' && (
                            // THE CSS FIX: Replaced space-y-8 with flex flex-col gap-8 to fix spacing bugs
                            <div className="flex flex-col gap-8 border-l border-slate-800 ml-2 pl-6 relative py-2">
                                
                                {/* THE MATH FIX: Perfect linear timeline anchored to the container */}
                                <motion.div
                                    initial={{ height: "0%" }}
                                    animate={{ height: "100%" }}
                                    transition={{ duration: TOTAL_DURATION, ease: "linear", delay: 0.2 }}
                                    className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-blue-500 to-indigo-500 z-20"
                                >
                                    {/* The glowing dot physically anchored inside the line */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#060B19] border-[3px] border-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] z-30"></div>
                                </motion.div>

                                {report?.preparationPlan?.map((plan, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                        transition={{ 
                                            duration: 0.6, 
                                            ease: "easeOut",
                                            // THE SYNC FIX: perfectly ties the card reveal to the fraction of the line drawn
                                            delay: 0.2 + ((TOTAL_DURATION / TOTAL_PHASES) * index)
                                        }}
                                        className="relative group z-10"
                                    >
                                        {/* THE PIXEL FIX: -left-[30px] instead of 31px perfectly centers this static dot on the line */}
                                        <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                                        
                                        <div className="bg-[#0E1526] border border-slate-800/80 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
                                            <h4 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
                                                <span className="text-blue-400 font-mono">Phase {plan.day}:</span> 
                                                {plan.focus}
                                            </h4>
                                            <ul className="space-y-2.5">
                                                {plan.tasks?.map((task, i) => (
                                                    <li key={i} className="text-sm text-slate-400 flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0 mt-1.5"></div>
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* 3. PROOF OF WORK PROJECTS */}
                        {activeTab === 'pow' && (
                            <div className="space-y-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-200">Standout Projects</h3>
                                    <p className="text-sm text-slate-400">Production-grade, hyper-targeted architectures to prove your engineering depth.</p>
                                </div>

                                {report?.proofOfWorkProjects?.map((project, index) => (
                                    <div key={index} className="bg-[#0E1526] border border-slate-700/80 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
                                        
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
                                                    {project.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
                                                        {project.estimatedTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10 space-y-4">
                                            <div className="bg-[#0A101D] p-4 rounded-xl border border-slate-800/50">
                                                <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">Business Value & ROI</h5>
                                                <p className="text-sm text-slate-300 leading-relaxed">{project.businessValue}</p>
                                            </div>

                                            <div>
                                                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Architecture & Execution</h5>
                                                <p className="text-sm text-slate-400 leading-relaxed">{project.architecture}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                                                {project.techStack?.map((tech, i) => (
                                                    <span key={i} className="text-xs font-medium text-slate-400 bg-[#060B19] px-2.5 py-1 rounded-md border border-slate-800">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {(!report?.proofOfWorkProjects || report?.proofOfWorkProjects.length === 0) && (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                        <Rocket size={32} className="mb-3 opacity-50" />
                                        <p>Generate a new report to unlock Proof of Work projects.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* 4. Q&A ACCORDION */}
                        {(activeTab === 'technical' || activeTab === 'behavioral') && (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    {(activeTab === 'technical' ? report?.technicalQuestions : report?.behavioralQuestions)?.map((q, index) => (
                                        <div key={index} className="border border-slate-800/80 rounded-xl overflow-hidden bg-[#0E1526] transition-all duration-200">
                                            <button 
                                                onClick={() => toggleQuestion(index)}
                                                className="w-full flex items-start justify-between p-5 text-left hover:bg-[#131C31] transition-colors"
                                            >
                                                <span className="font-medium text-slate-200 text-sm md:text-base leading-relaxed pr-6 flex gap-3">
                                                    <span className="text-blue-500 font-mono text-sm mt-0.5">Q{index + 1}.</span>
                                                    {q.question}
                                                </span>
                                                <div className="shrink-0 mt-0.5 text-slate-500">
                                                    {openQuestionIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </div>
                                            </button>
                                            
                                            {openQuestionIndex === index && (
                                                <div className="p-5 border-t border-slate-800/80 bg-[#0A101D] grid gap-6 md:grid-cols-2">
                                                    <div className="space-y-1.5">
                                                        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Interviewer Intention</h4>
                                                        <p className="text-sm text-slate-400 leading-relaxed">{q.intention}</p>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Optimal Approach</h4>
                                                        <p className="text-sm text-slate-300 leading-relaxed">{q.answer}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {/* Fallback check */}
                                    {!(activeTab === 'technical' ? report?.technicalQuestions : report?.behavioralQuestions)?.length && (
                                        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                            <AlertCircle size={32} className="mb-3 opacity-50" />
                                            <p>No questions generated for this section.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Interview;