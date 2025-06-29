
import React, { useState, useRef, useEffect } from 'react';
import { FirebaseUser, ProofreadingResult, SuggestionType } from '../types';
import { Icon } from '../components/Icons';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { proofreadTextWithGemini } from '../services/geminiService';

interface ProofreadingPageProps {
  currentUser: FirebaseUser | null;
}

const SuggestionCard: React.FC<{ suggestion: ProofreadingResult['suggestions'][0] }> = ({ suggestion }) => {
    const typeColors: Record<SuggestionType, string> = {
        Spelling: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
        Grammar: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
        Punctuation: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
        Style: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
        Clarity: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
        Other: 'bg-neutral-200 dark:bg-neutral-600/50 text-neutral-700 dark:text-neutral-300',
    };

    return (
        <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm p-4 rounded-lg shadow-md border border-neutral-200/50 dark:border-neutral-700/50">
            <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[suggestion.type]}`}>
                    {suggestion.type}
                </span>
            </div>
            <div className="mb-3 space-y-1 text-sm">
                <p className="text-neutral-500 dark:text-neutral-400">
                    <span className="line-through text-red-500/80 dark:text-red-400/80">{suggestion.original}</span>
                </p>
                <p className="text-neutral-800 dark:text-neutral-100">
                    <Icon icon="ArrowRightIcon" className="inline w-4 h-4 mr-2 text-green-500"/>
                    <span className="text-green-600 dark:text-green-400 font-medium">{suggestion.corrected}</span>
                </p>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 italic">
                <Icon icon="InformationCircleIcon" className="inline w-4 h-4 mr-1 align-text-bottom"/>
                {suggestion.explanation}
            </p>
        </div>
    );
};

const ProofreadingPage: React.FC<ProofreadingPageProps> = ({ currentUser }) => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<ProofreadingResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    
    const outputContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleProofread = async () => {
        if (!inputText.trim()) {
            setError("Please enter some text to proofread.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const proofreadResult = await proofreadTextWithGemini(inputText);
            setResult(proofreadResult);
        } catch (e: any) {
            console.error("Proofreading failed:", e);
            setError(e.message || "An unexpected error occurred while proofreading.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleClear = () => {
        setInputText('');
        setResult(null);
        setError(null);
    }
    
    const handleCopyToClipboard = () => {
        if (result?.correctedText) {
            navigator.clipboard.writeText(result.correctedText);
            setCopied(true);
        }
    };


    return (
        <div className="container mx-auto px-4 py-8 md:py-12 animate-fadeIn">
            <SectionTitle
                title="Proofreading & Editing"
                subtitle="Refine your writing with AI-powered error detection for spelling, grammar, and style."
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Input */}
                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 flex flex-col">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100 flex items-center">
                        <Icon icon="DocumentTextIcon" className="w-6 h-6 mr-2 text-orange-500"/>
                        Your Text
                    </h3>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste your text here..."
                        className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-y bg-white/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 flex-grow min-h-[300px]"
                        disabled={isLoading}
                    />
                    <div className="mt-4 flex space-x-2">
                         <Button onClick={handleProofread} disabled={isLoading || !inputText.trim()} isLoading={isLoading} className="flex-grow">
                            {isLoading ? 'Analyzing...' : 'Proofread'}
                         </Button>
                         <Button onClick={handleClear} variant="secondary" disabled={isLoading}>
                             Clear
                         </Button>
                    </div>
                </div>
                
                {/* Right Column: Output */}
                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30">
                     <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center">
                            <Icon icon="BadgeCheckIcon" className="w-6 h-6 mr-2 text-orange-500"/>
                            AI Suggestions
                        </h3>
                     </div>
                     {error && (
                        <div className="m-4 p-3 bg-red-100 dark:bg-red-800/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm">
                            <Icon icon="ExclamationCircleIcon" className="inline w-5 h-5 mr-2" />
                            {error}
                        </div>
                     )}
                     <div ref={outputContainerRef} className="h-[calc(100% - 70px)] overflow-y-auto p-6">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-neutral-600 dark:text-neutral-300">
                                <Icon icon="RefreshIcon" className="w-10 h-10 animate-spin mb-3 text-orange-500"/>
                                <p className="font-semibold">Analyzing your text...</p>
                                <p className="text-sm">Please wait a moment.</p>
                            </div>
                        )}
                        {!isLoading && !result && !error && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 dark:text-neutral-400">
                                 <Icon icon="SparklesIcon" className="w-16 h-16 mb-4 text-orange-400/50"/>
                                 <h4 className="text-lg font-medium text-neutral-600 dark:text-neutral-300">Corrections will appear here.</h4>
                                 <p>Paste your text on the left and click "Proofread".</p>
                            </div>
                        )}
                        {result && (
                            <div className="animate-fadeIn space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-100">Summary</h4>
                                    <p className="p-3 bg-green-50 dark:bg-green-800/20 rounded-md text-green-800 dark:text-green-300 text-sm font-medium">{result.summary}</p>
                                </div>
                                
                                {result.suggestions.length > 0 && (
                                    <div>
                                        <h4 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-neutral-100">Suggestions ({result.suggestions.length})</h4>
                                        <div className="space-y-4">
                                            {result.suggestions.map((s, i) => <SuggestionCard key={i} suggestion={s} />)}
                                        </div>
                                    </div>
                                )}
                                
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Corrected Text</h4>
                                        <Button onClick={handleCopyToClipboard} variant="ghost" size="sm" disabled={copied}>
                                            <Icon icon={copied ? "CheckCircleIcon" : "ClipboardCopyIcon"} className="w-4 h-4 mr-2"/>
                                            {copied ? 'Copied!' : 'Copy'}
                                        </Button>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none p-4 bg-neutral-100 dark:bg-neutral-900/50 rounded-md text-neutral-700 dark:text-neutral-200 text-sm leading-relaxed">
                                        {result.correctedText}
                                    </div>
                                </div>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ProofreadingPage;
