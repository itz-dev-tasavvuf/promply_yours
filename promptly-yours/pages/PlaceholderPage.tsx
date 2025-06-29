
import React from 'react';
import { Icon } from '../components/Icons';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';


interface PlaceholderPageProps {
  title: string;
  icon?: React.ElementType; // For a potential custom icon
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  const navigate = useNavigate();
  const randomSeed = title.replace(/\s+/g, '').toLowerCase() + 'glass'; // Add theme to seed for variation

  return (
    <div className="container mx-auto px-4 py-10 md:py-20 animate-fadeIn">
      <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-lg p-8 md:p-12 rounded-xl shadow-xl border border-white/20 dark:border-neutral-700/30 text-center">
        <div className="mx-auto text-orange-500 dark:text-orange-400 mb-6">
           {title === "Explore AI Tools" && <Icon icon="SparklesIcon" className="w-16 h-16 mx-auto" />}
           {title === "Recent Orders" && <Icon icon="ClipboardListIcon" className="w-16 h-16 mx-auto" />}
           {title === "Settings" && <Icon icon="CogIcon" className="w-16 h-16 mx-auto" />}
           {title === "Support Center" && <Icon icon="QuestionMarkCircleIcon" className="w-16 h-16 mx-auto" />}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-white mb-4">{title}</h1>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-xl mx-auto">
          The '{title}' section is currently under construction. We're working hard to bring you an amazing experience. Check back soon!
        </p>
        <div className="max-w-2xl mx-auto w-full aspect-[2/1] bg-neutral-200 dark:bg-neutral-700 rounded-lg shadow-lg overflow-hidden border border-neutral-300/50 dark:border-neutral-600/50">
          <img 
            src={`https://picsum.photos/seed/${randomSeed}/800/400`} 
            alt={`${title} placeholder illustration`} 
            className="w-full h-full object-cover" 
          />
        </div>
        <Button onClick={() => navigate('/')} variant="primary" size="lg" className="mt-12">
          <Icon icon="HomeIcon" className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
