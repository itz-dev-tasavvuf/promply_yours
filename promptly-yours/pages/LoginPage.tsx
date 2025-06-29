import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '../constants';
import Button from '../components/Button';
import { Icon } from '../components/Icons';
import { signInWithEmailPassword, signUpWithEmailPassword } from '../services/authService';
import { useAuth } from '../App'; // To manage global loading state if needed

type AuthMode = 'login' | 'signup';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoadingAuth } = useAuth(); // Global auth loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await signInWithEmailPassword(email, password);
      } else {
        await signUpWithEmailPassword(email, password);
      }
      navigate('/'); // Redirect to dashboard on success
    } catch (err: any) {
      // Firebase errors have a 'code' property
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential': // Added this case
            setError('Invalid email or password. Please try again.');
            break;
          case 'auth/email-already-in-use':
            setError('This email is already registered. Try logging in.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. It should be at least 6 characters.');
            break;
          case 'auth/operation-not-allowed':
             setError('Email/password accounts are not enabled. Contact support.');
             break;
          default:
            setError(err.message || 'An unexpected error occurred. Please try again.');
        }
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      console.error(`${mode} error:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
    setError(null); // Clear errors when switching modes
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-neutral-900/80 animate-fadeIn">
      <div className="max-w-md w-full space-y-8 p-8 md:p-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg shadow-2xl rounded-xl border border-white/20 dark:border-neutral-700/30">
        <div>
          <Icon icon="SparklesIcon" className="mx-auto h-12 w-auto text-orange-500 dark:text-orange-400" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-white">
            {mode === 'login' ? `Login to ${APP_NAME}` : `Create your ${APP_NAME} account`}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-neutral-300 dark:border-neutral-600 placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-900 dark:text-neutral-100 bg-white/70 dark:bg-neutral-700/70 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isLoadingAuth}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? "current-password" : "new-password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-neutral-300 dark:border-neutral-600 placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-900 dark:text-neutral-100 bg-white/70 dark:bg-neutral-700/70 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isLoadingAuth}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-800/40 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md text-sm">
              <Icon icon="ExclamationCircleIcon" className="inline w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              className="group relative w-full flex justify-center"
              isLoading={isLoading || isLoadingAuth}
              disabled={isLoading || isLoadingAuth}
            >
              {isLoading || isLoadingAuth ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
            </Button>
          </div>
        </form>

        <div className="text-sm text-center">
          <button
            onClick={toggleMode}
            disabled={isLoading || isLoadingAuth}
            className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 disabled:opacity-70 transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;