import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastProvider } from '../components/Toast';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';
import ChatbotBuilderPage from './pages/ChatbotBuilderPage';
import MyArcadePage from './pages/MyArcadePage';
import ContentWriterPage from './pages/ContentWriterPage'; 
import ProofreadingPage from './pages/ProofreadingPage';
import DataExtractionPage from './pages/DataExtractionPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import LoginPage from './pages/LoginPage';
import Button from '../components/Button';
import { APP_NAME } from './constants';
import { Icon } from '../components/Icons';
import { FirebaseUser } from './types';
import { signOutUser, onAuthUserChanged } from './services/authService';

// --- Theme Management ---
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) return storedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
  });

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
// --- End Theme Management ---

// --- Auth Context ---
interface AuthContextType {
  currentUser: FirebaseUser | null;
  isLoadingAuth: boolean;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthUserChanged((user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    setIsLoadingAuth(true);
    await signOutUser();
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, isLoadingAuth, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
// --- End Auth Context ---

// --- Landing Page Header ---
const LandingHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isLoadingAuth } = useAuth();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg shadow-soft border-b border-white/20 dark:border-neutral-700/30">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-500 flex items-center">
           <Icon icon="SparklesIcon" className="w-7 h-7 mr-2 text-orange-500" />
           {APP_NAME}
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button 
            onClick={goToLogin} 
            variant="primary" 
            size="md" 
            isLoading={isLoadingAuth} 
            disabled={isLoadingAuth}
            leftIcon="LoginIcon"
            className="btn-hover-lift"
          >
            {isLoadingAuth ? 'Loading...' : 'Login / Sign Up'}
          </Button>
        </div>
      </div>
    </header>
  );
};
// --- End Landing Page Header ---

// --- Main App Structure ---
const MainLayout: React.FC = () => {
  const { theme } = useTheme();
  const { currentUser, isLoadingAuth, handleLogout } = useAuth();
  const isLoggedIn = !!currentUser;

  if (isLoadingAuth) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans transition-colors duration-300 ${
        theme === Theme.DARK 
          ? 'bg-neutral-900 text-slate-100' 
          : 'bg-slate-100 text-neutral-800'
      }`}>
        <div className="text-center space-y-4">
          <Icon icon="SparklesIcon" className="w-16 h-16 text-orange-500 animate-pulse mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Loading {APP_NAME}...</h2>
            <div className="w-48 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        theme === Theme.DARK 
          ? 'bg-neutral-900 text-slate-100' 
          : 'bg-slate-100 text-neutral-800'
      }`}
    >
      {isLoggedIn ? (
        <Navbar currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LandingHeader />
      )}
      <main className="flex-grow w-full">
        <Routes>
          {!isLoggedIn ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<DashboardPage currentUser={currentUser} />} />
              <Route path="/content-writer" element={<ContentWriterPage currentUser={currentUser} />} />
              <Route path="/proofreading" element={<ProofreadingPage currentUser={currentUser} />} />
              <Route path="/data-extraction" element={<DataExtractionPage currentUser={currentUser} />} />
              <Route path="/resume-builder" element={<ResumeBuilderPage currentUser={currentUser} />} />
              <Route path="/chatbot-builder" element={<ChatbotBuilderPage currentUser={currentUser} />} />
              <Route path="/my-arcade" element={<MyArcadePage currentUser={currentUser} />} />
              <Route path="/explore" element={<PlaceholderPage title="Explore AI Tools" />} />
              <Route path="/orders" element={<PlaceholderPage title="Recent Orders" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
              <Route path="/support" element={<PlaceholderPage title="Support Center" />} />
              <Route path="/login" element={<Navigate replace to="/" />} />
            </>
          )}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <HashRouter>
              <MainLayout />
            </HashRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;