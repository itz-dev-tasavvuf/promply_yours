import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS_LOGGED_IN, APP_NAME } from '../constants';
import { FirebaseUser } from '../types';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { Icon } from './Icons';

interface NavbarProps {
  currentUser: FirebaseUser | null;
  onLogout: () => Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-neutral-700/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-600 dark:text-orange-500 flex items-center">
            <Icon icon="SparklesIcon" className="w-7 h-7 mr-2" />
            {APP_NAME}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS_LOGGED_IN.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                  location.pathname === item.path
                    ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {item.icon && <Icon icon={item.icon} className="w-4 h-4 mr-2" />}
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            <div className="flex items-center space-x-2">
              <Icon icon="UserCircleIcon" className="w-8 h-8 text-neutral-500 dark:text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {currentUser?.displayName || currentUser?.email || 'User'}
              </span>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm" leftIcon="LogoutIcon">
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <Icon icon="MenuIcon" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="space-y-2">
              {NAV_ITEMS_LOGGED_IN.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center ${
                    location.pathname === item.path
                      ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  {item.icon && <Icon icon={item.icon} className="w-4 h-4 mr-2" />}
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-4">
                <div className="flex items-center px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <Icon icon="UserCircleIcon" className="w-5 h-5 mr-2" />
                  {currentUser?.displayName || currentUser?.email || 'User'}
                </div>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full justify-start" leftIcon="LogoutIcon">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;