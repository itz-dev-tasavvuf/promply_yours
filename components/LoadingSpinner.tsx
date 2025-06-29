import React from 'react';
import { Icon } from './Icons';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Icon 
        icon="LoadingIcon" 
        className={`${sizeClasses[size]} text-orange-500 animate-spin`} 
      />
      {text && (
        <p className={`${textSizes[size]} text-neutral-600 dark:text-neutral-300 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;