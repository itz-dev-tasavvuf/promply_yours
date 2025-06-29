
import React from 'react';
import { Step } from '../../types';
import { Icon } from '../Icons';

interface StepCardProps {
  step: Step;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-white/70 via-white/60 to-orange-100/30 dark:from-neutral-800/70 dark:via-neutral-800/60 dark:to-orange-900/40 backdrop-blur-lg rounded-xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-orange-500/20 transition-all duration-300 transform hover:-translate-y-1">
      <div className="absolute -top-5 -left-3 flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white text-xl font-bold shadow-md">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="p-3 mb-4 bg-orange-500/80 dark:bg-orange-600/80 rounded-full text-white">
        <Icon icon={step.icon} className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2 text-center">{step.title}</h3>
      <p className="text-neutral-600 dark:text-neutral-300 text-center text-sm">{step.description}</p>
    </div>
  );
};

export default StepCard;
