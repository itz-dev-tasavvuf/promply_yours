import React from 'react';
import { Icon, IconType } from './Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'light';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: IconType;
  rightIcon?: IconType;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500 shadow-md hover:shadow-lg',
    secondary: 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 focus:ring-neutral-500',
    ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 focus:ring-neutral-500',
    light: 'bg-white hover:bg-neutral-50 text-orange-600 border border-orange-200 focus:ring-orange-500 shadow-sm'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  }[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Icon icon="RefreshIcon" className="animate-spin mr-2" size={iconSize} />
      ) : leftIcon ? (
        <Icon icon={leftIcon} className="mr-2" size={iconSize} />
      ) : null}
      
      {children}
      
      {rightIcon && !isLoading && (
        <Icon icon={rightIcon} className="ml-2" size={iconSize} />
      )}
    </button>
  );
};

export default Button;