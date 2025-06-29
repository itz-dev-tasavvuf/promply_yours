import React from 'react';
import { Project, Testimonial } from '../../types';
import { Icon } from '../Icons';

interface ProjectCardProps {
  item: Project | Testimonial; // Can be a Project or a Testimonial which might include project details
  type: 'project' | 'testimonial';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ item, type }) => {
  const isTestimonial = (data: Project | Testimonial): data is Testimonial => type === 'testimonial' && 'quote' in data;
  
  const imageUrl = isTestimonial(item) ? item.projectImageUrl : (item as Project).imageUrl;
  const name = isTestimonial(item) ? item.projectName : (item as Project).name;
  const description = isTestimonial(item) ? item.quote : (item as Project).description;

  const handleClick = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
        onClick={handleClick}
        onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        role="button"
        tabIndex={imageUrl ? 0 : -1}
        aria-label={`View image for ${name}`}
        className={`bg-gradient-to-b from-white/70 via-white/60 to-orange-100/20 dark:from-neutral-800/70 dark:via-neutral-800/60 dark:to-orange-900/30 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden hover:shadow-2xl border border-white/20 dark:border-orange-500/20 transition-all duration-300 flex flex-col group ${imageUrl ? 'cursor-pointer' : ''} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900`}
    >
      {imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
      )}
      <div className="p-6 flex-grow flex flex-col">
        {isTestimonial(item) && (
          <div className="flex items-center mb-3">
            <img src={item.avatarUrl} alt={item.name} className="w-10 h-10 rounded-full mr-3 border-2 border-orange-400/50 dark:border-orange-500/70"/>
            <span className="font-semibold text-neutral-700 dark:text-neutral-200">{item.name}</span>
          </div>
        )}
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">{name}</h3>
        <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3 flex-grow">{description}</p>
        
        {'aiModelUsed' in item && item.aiModelUsed && (
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-auto pt-2 border-t border-neutral-300/50 dark:border-neutral-600/50">
                <Icon icon="ChipIcon" className="w-4 h-4 inline mr-1" /> AI Model: {item.aiModelUsed}
            </p>
        )}
        {'tags' in item && (item as Project).tags && (item as Project).tags!.length > 0 && (
          <div className="mt-2">
            {(item as Project).tags?.map(tag => (
              <span key={tag} className="text-xs bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full mr-1 mb-1 inline-block">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;