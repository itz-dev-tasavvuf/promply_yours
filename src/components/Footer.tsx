import React from 'react';
import { APP_NAME } from '../constants';
import { Icon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-lg border-t border-white/20 dark:border-neutral-700/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Icon icon="SparklesIcon" className="w-6 h-6 mr-2 text-orange-500" />
            <span className="text-xl font-bold text-orange-600 dark:text-orange-500">{APP_NAME}</span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Empowering productivity with AI-powered tools. Pay per task, not per month.
          </p>
          <div className="text-xs text-neutral-500 dark:text-neutral-500">
            © 2024 {APP_NAME}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;