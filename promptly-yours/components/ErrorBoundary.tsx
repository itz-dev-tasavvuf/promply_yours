import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Icon } from './Icons';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-neutral-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <Icon 
                icon="ExclamationCircleIcon" 
                size="xl" 
                className="mx-auto text-red-500 mb-4" 
              />
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                We encountered an unexpected error. Please try again.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                  Error Details:
                </h3>
                <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                variant="primary"
                fullWidth
                leftIcon="RefreshIcon"
              >
                Try Again
              </Button>
              <Button 
                onClick={this.handleReload}
                variant="secondary"
                fullWidth
                leftIcon="ArrowRightIcon"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;