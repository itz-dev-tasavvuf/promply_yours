
import React, { useState } from 'react';
import { FirebaseUser, ResumeOptimizationResult } from '../types';
import { Icon, IconType } from '../components/Icons';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { optimizeResumeAndGenerateCoverLetter } from '../services/geminiService';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4'

interface ResumeBuilderPageProps {
  currentUser: FirebaseUser | null;
}

const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({ currentUser }) => {
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState<ResumeOptimizationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter' | 'analysis'>('resume');

    const handleGenerate = async () => {
        if (!resumeText.trim() || !jobDescription.trim()) {
            setError("Please provide both your resume and the job description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const optimizationResult = await optimizeResumeAndGenerateCoverLetter(resumeText, jobDescription);
            setResult(optimizationResult);
            setActiveTab('resume'); // Default to showing resume first
        } catch (e: any) {
            console.error("Resume optimization failed:", e);
            setError(e.message || "An unexpected error occurred during optimization.");
        } finally {
            setIsLoading(false);
        }
    };

    const TabButton: React.FC<{ tabName: 'resume' | 'coverLetter' | 'analysis', label: string, icon: IconType }> = ({ tabName, label, icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 p-3 font-semibold text-sm transition-colors rounded-t-lg flex items-center justify-center space-x-2 border-b-2 ${
                activeTab === tabName
                    ? 'text-orange-600 dark:text-orange-400 border-orange-500'
                    : 'text-neutral-500 dark:text-neutral-400 border-transparent hover:bg-neutral-500/10'
            }`}
        >
            <Icon icon={icon} className="w-5 h-5" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fadeIn">
            <SectionTitle
                title="Resume & Cover Letter Builder"
                subtitle="Optimize your resume for any job and generate a tailored cover letter in seconds."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30">
                        <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100 flex items-center">
                            <Icon icon="DocumentTextIcon" className="w-6 h-6 mr-2 text-orange-500"/>
                            1. Your Resume
                        </h3>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your current resume here..."
                            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-y bg-white/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 min-h-[250px]"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30">
                        <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100 flex items-center">
                            <Icon icon="ClipboardListIcon" className="w-6 h-6 mr-2 text-orange-500"/>
                            2. Job Description
                        </h3>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description here..."
                            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-y bg-white/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 min-h-[250px]"
                            disabled={isLoading}
                        />
                    </div>
                     {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-800/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md text-sm">
                            <Icon icon="ExclamationCircleIcon" className="inline w-5 h-5 mr-2" /> {error}
                        </div>
                     )}
                     <Button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !resumeText.trim() || !jobDescription.trim()} 
                        isLoading={isLoading} 
                        className="w-full"
                    >
                        {isLoading ? 'Analyzing...' : 'Optimize & Generate'}
                     </Button>
                </div>
                
                {/* Right Column: Output */}
                <div className="lg:col-span-3 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 flex flex-col">
                     <div className="p-2 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="flex">
                            <TabButton tabName="resume" label="Optimized Resume" icon="IdentificationIcon" />
                            <TabButton tabName="coverLetter" label="Cover Letter" icon="MailIcon" />
                            <TabButton tabName="analysis" label="Analysis" icon="LightBulbIcon" />
                        </div>
                     </div>
                     
                     <div className="h-[calc(80vh)] overflow-y-auto p-6">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-600 dark:text-neutral-300">
                                <Icon icon="RefreshIcon" className="w-10 h-10 animate-spin mb-3 text-orange-500"/>
                                <p className="font-semibold">Optimizing your documents...</p>
                                <p className="text-sm">Please wait, this can take a moment.</p>
                            </div>
                        )}
                        {!isLoading && !result && !error && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 dark:text-neutral-400">
                                 <Icon icon="SparklesIcon" className="w-16 h-16 mb-4 text-orange-400/50"/>
                                 <h4 className="text-lg font-medium text-neutral-600 dark:text-neutral-300">Your tailored documents will appear here.</h4>
                                 <p>Fill in the details on the left and click "Optimize & Generate".</p>
                            </div>
                        )}
                        {result && (
                            <div className="animate-fadeIn">
                                {activeTab === 'resume' && (
                                    <article className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-200">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.optimizedResume}</ReactMarkdown>
                                    </article>
                                )}
                                {activeTab === 'coverLetter' && (
                                     <article className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-200">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.coverLetter.replace(/\n/g, '  \n')}</ReactMarkdown>
                                     </article>
                                )}
                                {activeTab === 'analysis' && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">Optimization Suggestions</h3>
                                        {result.suggestions.map((s, i) => (
                                            <div key={i} className="bg-neutral-100/70 dark:bg-neutral-900/50 p-4 rounded-lg">
                                                <p className="font-semibold text-orange-600 dark:text-orange-400">{s.area}</p>
                                                <p className="text-neutral-700 dark:text-neutral-300 text-sm">{s.suggestion}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilderPage;
