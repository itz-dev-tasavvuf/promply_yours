
import React, { useState, useRef, useEffect } from 'react';
import { FirebaseUser, ContentPlanStep } from '../types';
import { Icon } from '../components/Icons';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { generateStructuredContentPlan, generateTextWithGemini } from '../services/geminiService';

interface ContentWriterPageProps {
  currentUser: FirebaseUser | null;
}

const ContentWriterPage: React.FC<ContentWriterPageProps> = ({ currentUser }) => {
  const [topic, setTopic] = useState('');
  const [plan, setPlan] = useState<ContentPlanStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the output container as new content is added
    if (outputContainerRef.current) {
        outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [plan]);


  const handleGenerate = async () => {
    if (!topic.trim()) {
        setError("Please enter a topic to begin.");
        return;
    }
    setIsGenerating(true);
    setError(null);
    setPlan([]); // Clear previous plan

    try {
        // 1. Generate the content plan
        const rawPlan = await generateStructuredContentPlan(topic);
        const initialPlan: ContentPlanStep[] = rawPlan.map((step, index) => ({
            id: index,
            title: step.title,
            description: step.description,
            status: 'pending',
            content: ''
        }));
        setPlan(initialPlan);

        // 2. Sequentially generate content for each step using functional updates
        for (const step of initialPlan) {
            // Mark as in-progress
            setPlan(currentPlan => 
                currentPlan.map(p => p.id === step.id ? { ...p, status: 'in-progress' } : p)
            );

            const generationPrompt = `The overall topic is "${topic}". Write the content for the section titled "${step.title}". Follow this instruction: "${step.description}". Write at least 2-3 paragraphs. The output should be only the text content for this section, without the title.`;
            
            try {
                const stepContent = await generateTextWithGemini(generationPrompt, currentUser?.uid);
                // On success, update with the new content and 'complete' status
                setPlan(currentPlan =>
                    currentPlan.map(p => p.id === step.id ? { ...p, status: 'complete', content: stepContent } : p)
                );
            } catch (stepError) {
                console.error(`Error on step ${step.id}:`, stepError);
                // On error, update with the 'error' status
                setPlan(currentPlan =>
                    currentPlan.map(p => p.id === step.id ? { ...p, status: 'error', content: 'Failed to generate content for this step.' } : p)
                );
                // Stop the entire generation process
                throw new Error(`Failed during content generation at step: "${step.title}".`);
            }
        }
    } catch (e: any) {
        console.error("Content generation failed:", e);
        setError(e.message || "An unexpected error occurred during content generation.");
    } finally {
        setIsGenerating(false);
    }
  };

  const getStatusIcon = (status: ContentPlanStep['status']) => {
    switch (status) {
        case 'pending': return <Icon icon="ClockIcon" className="w-5 h-5 text-neutral-400" />;
        case 'in-progress': return <Icon icon="RefreshIcon" className="w-5 h-5 text-orange-500 animate-spin" />;
        case 'complete': return <Icon icon="CheckCircleIcon" className="w-5 h-5 text-green-500" />;
        case 'error': return <Icon icon="ExclamationCircleIcon" className="w-5 h-5 text-red-500" />;
    }
  }
  
  const finalContent = plan
    .filter(step => step.status === 'complete')
    .map(step => `## ${step.title}\n\n${step.content}`)
    .join('\n\n');

  const copyToClipboard = () => {
      navigator.clipboard.writeText(finalContent);
      // Add a small visual feedback if desired
  }


  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fadeIn">
        <SectionTitle 
            title="AI Content Writer"
            subtitle="Generate high-quality articles, blog posts, and more with a structured, step-by-step approach."
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Controls & Plan */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30">
                    <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100 flex items-center">
                        <Icon icon="PencilAltIcon" className="w-6 h-6 mr-2 text-orange-500"/>
                        1. Your Topic
                    </h3>
                    <textarea 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., A blog post about the benefits of remote work for startups"
                        className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none bg-white/80 dark:bg-neutral-700/80 text-neutral-800 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 min-h-[100px]"
                        rows={4}
                        disabled={isGenerating}
                    />
                    <Button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} isLoading={isGenerating} className="w-full mt-4">
                        {isGenerating ? 'Generating...' : 'Generate Content'}
                    </Button>
                </div>

                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 min-h-[200px]">
                     <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100 flex items-center">
                        <Icon icon="ChipIcon" className="w-6 h-6 mr-2 text-orange-500"/>
                        2. AI's Plan
                    </h3>
                    {isGenerating && plan.length === 0 && (
                        <div className="text-center text-neutral-600 dark:text-neutral-300 py-4">
                            <Icon icon="RefreshIcon" className="w-8 h-8 mx-auto animate-spin mb-2" />
                            <p>AI is thinking about the best structure...</p>
                        </div>
                    )}
                    {plan.length > 0 && (
                        <ul className="space-y-3">
                           {plan.map(step => (
                               <li key={step.id} className="flex items-start space-x-3 p-2 rounded-md bg-neutral-100/50 dark:bg-neutral-700/50">
                                   <div className="flex-shrink-0 pt-1">{getStatusIcon(step.status)}</div>
                                   <div>
                                     <p className="font-medium text-neutral-700 dark:text-neutral-200">{step.title}</p>
                                     <p className="text-xs text-neutral-500 dark:text-neutral-400">{step.status === 'in-progress' ? 'Writing...' : step.status === 'complete' ? 'Done' : step.status === 'error' ? 'Error' : 'Waiting...'}</p>
                                   </div>
                               </li>
                           ))}
                        </ul>
                    )}
                     {!isGenerating && plan.length === 0 && (
                        <div className="text-center text-neutral-500 dark:text-neutral-400 py-4">
                            <p>The content generation plan will appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Output */}
            <div className="lg:col-span-2 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-1 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30">
                <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
                     <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center">
                        <Icon icon="DocumentTextIcon" className="w-6 h-6 mr-2 text-orange-500"/>
                        3. Generated Content
                    </h3>
                    <Button onClick={copyToClipboard} variant="secondary" size="sm" disabled={!finalContent || isGenerating}>
                       <Icon icon="ClipboardCopyIcon" className="w-4 h-4 mr-2" />
                       Copy
                    </Button>
                </div>
                 {error && (
                    <div className="m-4 p-3 bg-red-100 dark:bg-red-800/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm">
                        <Icon icon="ExclamationCircleIcon" className="inline w-5 h-5 mr-2" />
                        {error}
                    </div>
                 )}
                <div ref={outputContainerRef} className="p-6 h-[60vh] overflow-y-auto">
                    {plan.length === 0 && !isGenerating && !error && (
                         <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 dark:text-neutral-400">
                             <Icon icon="SparklesIcon" className="w-16 h-16 mb-4 text-orange-400/50"/>
                             <h4 className="text-lg font-medium text-neutral-600 dark:text-neutral-300">Your article will appear here.</h4>
                             <p>Enter a topic on the left and click "Generate Content" to start.</p>
                         </div>
                    )}

                    <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-200">
                        {plan.map(step => (
                           (step.status === 'complete' || step.status === 'error') && (
                               <div key={step.id} className="mb-6 animate-fadeIn">
                                   <h2 className="text-2xl font-bold mt-4 mb-3 pb-2 border-b border-neutral-300/70 dark:border-neutral-600/70 text-neutral-800 dark:text-neutral-100">{step.title}</h2>
                                   {step.content.split('\n').filter(p => p.trim() !== '').map((paragraph, pIndex) => (
                                       <p key={pIndex} className={`mb-4 leading-relaxed ${step.status === 'error' ? 'text-red-500 dark:text-red-400' : ''}`}>{paragraph}</p>
                                   ))}
                               </div>
                           )
                        ))}
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};

export default ContentWriterPage;