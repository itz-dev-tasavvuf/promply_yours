import React from 'react';
import { FeaturePoint } from '../../types';
import { Icon } from '../Icons';

interface FeatureCardProps {
  feature: FeaturePoint;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 dark:border-neutral-700/30 hover:shadow-xl transition-all duration-300 text-center">
      <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon={feature.icon} className="w-8 h-8 text-orange-600 dark:text-orange-400" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
        {feature.title}
      </h3>
      <p className="text-neutral-600 dark:text-neutral-300">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;