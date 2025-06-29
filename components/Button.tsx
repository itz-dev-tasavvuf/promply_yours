import React from 'react';
import { Icon, IconType } from './Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'light' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: IconType;
  rightIcon?: IconType;
  isLoading?: boolean;
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  fullWidth = false,
  rounded = 'lg',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out inline-flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-500 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 shadow-orange-500/25',
    secondary: 'bg-gradient-to-r from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 text-neutral-700 focus:ring-neutral-400 dark:from-neutral-700 dark:to-neutral-800 dark:hover:from-neutral-600 dark:hover:to-neutral-700 dark:text-neutral-100 dark:focus:ring-neutral-500 border border-neutral-300/50 dark:border-neutral-600/50',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500 shadow-red-500/25',
    ghost: 'bg-transparent shadow-none hover:bg-orange-500/10 text-orange-600 focus:ring-orange-500 dark:text-orange-400 dark:hover:bg-orange-500/20 border border-transparent hover:border-orange-500/20',
    light: 'bg-white/90 text-orange-600 hover:bg-white focus:ring-orange-400 backdrop-blur-sm border border-white/50 dark:bg-slate-100/90 dark:text-orange-700 dark:hover:bg-slate-100 dark:focus:ring-orange-500 shadow-white/25',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500 shadow-green-500/25',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white focus:ring-yellow-500 shadow-yellow-500/25',
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const iconSizes = {
    xs: 'xs' as const,
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
    xl: 'lg' as const,
  };

  const loadingStyles = isLoading ? 'cursor-wait' : '';
  const widthStyles = fullWidth ? 'w-full' : '';
  const hoverEffects = !disabled && !isLoading ? 'hover:scale-105 active:scale-95' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles[rounded]} ${loadingStyles} ${widthStyles} ${hoverEffects} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
          <Icon icon="LoadingIcon" className="animate-spin" size={iconSizes[size]} />
        </div>
      )}
      
      {/* Content */}
      <div className={`flex items-center justify-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {leftIcon && !isLoading && (
          <Icon 
            icon={leftIcon} 
            size={iconSizes[size]}
            className="mr-2 flex-shrink-0" 
          />
        )}
        
        {children && (
          <span className="flex-grow text-center">
            {children}
          </span>
        )}
        
        {rightIcon && !isLoading && (
          <Icon 
            icon={rightIcon} 
            size={iconSizes[size]}
            className="ml-2 flex-shrink-0" 
          />
        )}
      </div>
    </button>
  );
};

export default Button;