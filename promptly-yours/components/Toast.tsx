import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Icon, IconType } from './Icons';
import Button from './Button';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    const baseStyles = 'p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 transform';
    
    const typeStyles = {
      success: 'bg-green-50/90 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      error: 'bg-red-50/90 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      warning: 'bg-yellow-50/90 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
      info: 'bg-blue-50/90 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    };

    const visibilityStyles = isVisible 
      ? 'translate-x-0 opacity-100 scale-100' 
      : 'translate-x-full opacity-0 scale-95';

    return `${baseStyles} ${typeStyles[toast.type]} ${visibilityStyles}`;
  };

  const getIcon = (): IconType => {
    const iconMap = {
      success: 'CheckCircleIcon' as const,
      error: 'XCircleIcon' as const,
      warning: 'ExclamationCircleIcon' as const,
      info: 'InformationCircleIcon' as const,
    };
    return iconMap[toast.type];
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start">
        <Icon 
          icon={getIcon()} 
          size="sm" 
          className="flex-shrink-0 mt-0.5 mr-3" 
        />
        
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm opacity-90 mt-1">{toast.message}</p>
          )}
          
          {toast.action && (
            <div className="mt-3">
              <Button
                size="xs"
                variant="ghost"
                onClick={toast.action.onClick}
                className="text-current hover:bg-current/10"
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>

        <Button
          size="xs"
          variant="ghost"
          onClick={handleRemove}
          className="flex-shrink-0 ml-2 text-current hover:bg-current/10 !p-1"
        >
          <Icon icon="XIcon" size="xs" />
        </Button>
      </div>
    </div>
  );
};

export default ToastItem;