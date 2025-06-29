import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiService } from '../../types';
import { Icon } from '../Icons';

const servicePathMap: Record<string, string> = {
  servChatbot: '/chatbot-builder',
  servContent: '/content-writer',
  servProofread: '/proofreading',
  servDataExtract: '/data-extraction',
  servResume: '/resume-builder',
};

interface ServiceCardProps {
  service: AiService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();
  const path = servicePathMap[service.id] || '/explore'; // Fallback to /explore

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div
      onClick={handleClick}
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      role="link"
      aria-label={`Explore ${service.name}`}
      tabIndex={0}
      className="group bg-gradient-to-br from-white/70 via-white/60 to-orange-100/30 dark:from-neutral-800/70 dark:via-neutral-800/60 dark:to-orange-900/40 backdrop-blur-lg rounded-xl shadow-xl p-6 hover:shadow-2xl border border-white/20 dark:border-orange-500/20 transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 bg-orange-100/70 dark:bg-orange-500/30 rounded-full text-orange-600 dark:text-orange-400 mr-4">
          <Icon icon={service.icon} className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{service.name}</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{service.category}</p>
        </div>
      </div>
      <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4 flex-grow">{service.description}</p>
      <div className="mt-auto self-start text-orange-600 dark:text-orange-400 font-medium inline-flex items-center text-sm">
        Explore Service
        <Icon icon="ArrowRightIcon" className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
};

export default ServiceCard;
