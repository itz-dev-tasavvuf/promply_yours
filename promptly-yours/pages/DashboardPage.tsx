import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/cards/ServiceCard';
import ProjectCard from '../components/cards/ProjectCard';
import ModelCard from '../components/cards/ModelCard';
import { USER_INTERESTS_SERVICES, INSPIRED_PROJECTS_DATA, BEST_AI_MODELS_DATA, DEFAULT_USER } from '../constants';
import { getAiRecommendations, getInspiredProjects, getBestAiModels } from '../services/geminiService'; // Simulated
import { Recommendation, Project, AiModel, FirebaseUser } from '../types';
import { Icon } from '../components/Icons';

interface DashboardPageProps {
  currentUser: FirebaseUser | null;
}

const servicePathMap: Record<string, string> = {
  servChatbot: '/chatbot-builder',
  servContent: '/content-writer',
  servProofread: '/proofreading',
  servDataExtract: '/data-extraction',
  servResume: '/resume-builder',
};

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [inspiredProjects, setInspiredProjects] = useState<Project[]>([]);
  const [bestModels, setBestModels] = useState<AiModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userName = currentUser?.displayName || DEFAULT_USER.name;
  // User interests could potentially come from Firebase in the future
  const userInterests = DEFAULT_USER.interests; 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Pass user's actual ID for potential future personalized results if API supported it
        const recs = await getAiRecommendations(userInterests, currentUser?.uid);
        setRecommendations(recs.slice(0,3));
        
        const projects = await getInspiredProjects(currentUser?.uid);
        setInspiredProjects(projects.slice(0,3));

        const models = await getBestAiModels(currentUser?.uid);
        setBestModels(models.slice(0,4));
        
      } catch (error)
      {
        console.error("Failed to fetch dashboard data:", error);
        // Fallback to mock data
        const fallbackRecs = USER_INTERESTS_SERVICES.filter(s => userInterests.some(interest => s.category.includes(interest))).slice(0,3) || USER_INTERESTS_SERVICES.slice(0,3);
        setRecommendations(fallbackRecs);
        setInspiredProjects(INSPIRED_PROJECTS_DATA.slice(0,3));
        setBestModels(BEST_AI_MODELS_DATA.slice(0,4));
      }
      setIsLoading(false);
    };

    fetchData();
  }, [currentUser, userInterests]); // Re-fetch if currentUser or their interests change
  
  const handleRecommendationClick = (serviceId: string) => {
    const path = servicePathMap[serviceId] || '/explore';
    navigate(path);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16 animate-fadeIn">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-white/70 via-orange-50/50 to-white/70 dark:from-neutral-800/70 dark:via-orange-900/30 dark:to-neutral-800/70 backdrop-blur-lg p-8 md:p-12 rounded-xl shadow-xl border border-white/20 dark:border-orange-500/20 text-neutral-800 dark:text-neutral-100">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300">Ready to tackle your next task with AI? Here are some suggestions based on your interests:</p>
        {isLoading && recommendations.length === 0 && <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading recommendations...</p>}
        {!isLoading && recommendations.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(rec => (
              <div 
                key={rec.id} 
                onClick={() => handleRecommendationClick(rec.id)}
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleRecommendationClick(rec.id); }}
                role="link"
                tabIndex={0}
                aria-label={`Explore ${rec.name}`}
                className="bg-white/50 dark:bg-neutral-700/50 backdrop-blur-sm p-4 rounded-lg hover:bg-white/70 dark:hover:bg-neutral-700/70 transition-colors cursor-pointer shadow-md border border-white/10 dark:border-neutral-600/30 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <div className="flex items-center">
                   <Icon icon={rec.icon} className="w-6 h-6 mr-3 text-orange-500 dark:text-orange-400"/>
                   <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">{rec.name}</h3>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 truncate">{rec.description}</p>
              </div>
            ))}
          </div>
        )}
         {!isLoading && recommendations.length === 0 && (
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">No specific recommendations for now. Explore our services below!</p>
        )}
      </section>

      {/* Your Interests Section / Recommended Services */}
      <section>
        <SectionTitle title="AI Tools For You" subtitle="Handpicked AI services relevant to your interests and past activity." />
        {isLoading && USER_INTERESTS_SERVICES.filter(service => userInterests.includes(service.category) || recommendations.find(r => r.id === service.id)).slice(0,6).length === 0 && 
            <div className="text-center p-8 dark:text-neutral-300 text-neutral-600">Loading services... <Icon icon="RefreshIcon" className="w-8 h-8 mx-auto animate-spin mt-2"/></div>}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {USER_INTERESTS_SERVICES.filter(service => userInterests.includes(service.category) || recommendations.find(r => r.id === service.id)).slice(0,6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
            {USER_INTERESTS_SERVICES.filter(service => userInterests.includes(service.category) || recommendations.find(r => r.id === service.id)).length === 0 && !isLoading && (
                <p className="text-center col-span-full text-neutral-600 dark:text-neutral-400">No specific recommendations for now. Explore all services!</p>
            )}
          </div>
        )}
      </section>

      {/* Get Inspired (Showcasing AI Projects) */}
      <section>
        <SectionTitle title="Get Inspired" subtitle="Discover what others are creating with AI on our platform." />
         {isLoading && inspiredProjects.length === 0 && <div className="text-center p-8 dark:text-neutral-300 text-neutral-600">Loading projects... <Icon icon="RefreshIcon" className="w-8 h-8 mx-auto animate-spin mt-2"/></div>}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {inspiredProjects.map((project) => (
              <ProjectCard key={project.id} item={project} type="project" />
            ))}
             {inspiredProjects.length === 0 && !isLoading && (
                <p className="text-center col-span-full text-neutral-600 dark:text-neutral-400">No projects to display at the moment.</p>
            )}
          </div>
        )}
      </section>

      {/* Best AI Models (Performance & Price Comparison) */}
      <section>
        <SectionTitle title="Featured AI Models" subtitle="Compare top-performing AI models and their costs to find the perfect fit for your task." />
        {isLoading && bestModels.length === 0 && <div className="text-center p-8 dark:text-neutral-300 text-neutral-600">Loading models... <Icon icon="RefreshIcon" className="w-8 h-8 mx-auto animate-spin mt-2"/></div>}
        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {bestModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
            {bestModels.length === 0 && !isLoading && (
                <p className="text-center col-span-full text-neutral-600 dark:text-neutral-400">No featured models available right now.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;