import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiModel } from '../../types';
import { Icon } from '../Icons';
import Button from '../Button';

interface ModelCardProps {
  model: AiModel;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // For now, all models link to the general explore page as a placeholder action
    navigate('/explore');
  };

  return (
    <div className="bg-gradient-to-bl from-white/70 via-white/60 to-orange-100/30 dark:from-neutral-800/70 dark:via-neutral-800/60 dark:to-orange-900/40 backdrop-blur-lg rounded-xl shadow-xl p-6 hover:shadow-2xl border border-white/20 dark:border-orange-500/20 transition-all duration-300 flex flex-col transform hover:scale-105">
      <div className="flex items-start mb-4">
        <div className="p-2 bg-orange-100/70 dark:bg-orange-500/30 rounded-full text-orange-600 dark:text-orange-400 mr-4">
          <Icon icon={model.icon} className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{model.name}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Provider: {model.provider}</p>
        </div>
      </div>
      <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3 flex-grow">{model.description}</p>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Cost: <span className="text-orange-600 dark:text-orange-400 font-bold">{model.costPerTask}</span></p>
        {model.performanceMetrics.accuracy && <p className="text-xs text-neutral-500 dark:text-neutral-400">Accuracy: {model.performanceMetrics.accuracy}</p>}
        {model.performanceMetrics.speed && <p className="text-xs text-neutral-500 dark:text-neutral-400">Speed: {model.performanceMetrics.speed}</p>}
        {model.performanceMetrics.quality && <p className="text-xs text-neutral-500 dark:text-neutral-400">Quality: {model.performanceMetrics.quality}</p>}
      </div>

      {model.tags && model.tags.length > 0 && (
        <div className="mb-4">
          {model.tags.map(tag => (
            <span key={tag} className="text-xs bg-neutral-200/70 dark:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-full mr-1 mb-1 inline-block">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <Button variant="primary" size="sm" className="mt-auto w-full" onClick={handleClick}>
        Use Model
      </Button>
    </div>
  );
};

export default ModelCard;