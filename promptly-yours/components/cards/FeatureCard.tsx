
import React from 'react';
import { FeaturePoint } from '../../types';
import { Icon } from '../Icons';

interface FeatureCardProps {
  feature: FeaturePoint;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <div className="flex flex-col items-center p-6 text-center bg-gradient-to-tl from-white/70 via-white/60 to-orange-100/30 dark:from-neutral-800/70 dark:via-neutral-800/60 dark:to-orange-900/40 backdrop-blur-lg rounded-xl shadow-xl hover:shadow-2xl border border-white/20 dark:border-orange-500/20 transition-all duration-300 transform hover:scale-105">
      <div className="p-4 mb-4 bg-orange-500/80 dark:bg-orange-600/80 rounded-full text-white">
        <Icon icon={feature.icon} className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">{feature.title}</h3>
      <p className="text-neutral-600 dark:text-neutral-300 text-sm">{feature.description}</p>
    </div>
  );
};

export default FeatureCard;
