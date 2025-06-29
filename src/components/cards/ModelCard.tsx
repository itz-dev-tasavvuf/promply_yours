import React from 'react';
import { AiModel } from '../../types';
import { Icon } from '../Icons';

interface ModelCardProps {
  model: AiModel;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <Icon icon={model.icon} className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            {model.name}
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {model.provider}
          </p>
        </div>
      </div>
      
      <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
        {model.description}
      </p>
      
      <div className="space-y-2 mb-4">
        {Object.entries(model.performanceMetrics).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400 capitalize">
              {key}:
            </span>
            <span className="text-neutral-700 dark:text-neutral-200 font-medium">
              {value}
            </span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-orange-600 dark:text-orange-400 font-semibold">
          {model.costPerTask}
        </span>
        <div className="flex flex-wrap gap-1">
          {model.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelCard;