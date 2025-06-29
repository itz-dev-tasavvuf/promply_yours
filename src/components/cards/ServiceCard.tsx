import React from 'react';
import { Link } from 'react-router-dom';
import { AiService } from '../../types';
import { Icon } from '../Icons';

interface ServiceCardProps {
  service: AiService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getServicePath = (serviceId: string): string => {
    const pathMap: Record<string, string> = {
      servChatbot: '/chatbot-builder',
      servContent: '/content-writer',
      servProofread: '/proofreading',
      servDataExtract: '/data-extraction',
      servResume: '/resume-builder',
    };
    return pathMap[serviceId] || '/explore';
  };

  return (
    <Link
      to={getServicePath(service.id)}
      className="group block bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
          <Icon icon={service.icon} className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {service.name}
          </h3>
          <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
            {service.category}
          </span>
        </div>
      </div>
      <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
        {service.description}
      </p>
    </Link>
  );
};

export default ServiceCard;