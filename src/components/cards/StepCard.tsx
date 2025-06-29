import React from 'react';
import { Step } from '../../types';
import { Icon } from '../Icons';

interface StepCardProps {
  step: Step;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  return (
    <div className="relative text-center">
      <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 hover:shadow-xl transition-all duration-300">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon={step.icon} className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {step.id}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
          {step.title}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300">
          {step.description}
        </p>
      </div>
      
      {/* Connector line for desktop */}
      {index < 2 && (
        <div className="hidden md:block absolute top-1/2 left-full w-12 h-0.5 bg-orange-300 dark:bg-orange-600 transform -translate-y-1/2 z-10">
          <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
            <Icon icon="ArrowRightIcon" className="w-4 h-4 text-orange-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StepCard;