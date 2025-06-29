
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS_LOGGED_IN, APP_NAME } from '../constants';
import ThemeToggle from './ThemeToggle';
import { Icon, IconType } from './Icons';
import Button from './Button';
import { FirebaseUser } from '../types';

interface NavbarProps {
  currentUser: FirebaseUser | null; // Now receives the Firebase user object
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userName = currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'User';

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-lg shadow-md border-b border-white/20 dark:border-neutral-700/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Nav */}
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 text-2xl font-bold text-orange-600 dark:text-orange-500">
               <Icon icon="SparklesIcon" className="inline-block w-7 h-7 mr-2 align-middle" />
              {APP_NAME}
            </NavLink>
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
              {NAV_ITEMS_LOGGED_IN.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-500/10 hover:text-neutral-900 dark:hover:text-white'
                    }`
                  }
                >
                  {item.icon && <Icon icon={item.icon as IconType} className="inline-block w-5 h-5 mr-1 align-text-bottom" />}
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Search Bar and Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="SearchIcon" className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300/70 dark:border-neutral-600/70 rounded-md leading-5 bg-white/50 dark:bg-neutral-700/50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-neutral-800 dark:text-neutral-100 transition-colors"
                placeholder="Search AI models..."
              />
            </div>
            <ThemeToggle />
            <div className="relative group">
               <Button variant="ghost" size="sm" className="flex items-center text-neutral-700 dark:text-neutral-200 hover:bg-neutral-500/10">
                 {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="h-6 w-6 rounded-full mr-2" />
                 ) : (
                    <Icon icon="UserCircleIcon" className="h-6 w-6 mr-1" />
                 )}
                 {userName}
               </Button>
               <div className="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-md shadow-lg py-1 hidden group-hover:block ring-1 ring-black/5 dark:ring-white/10">
                 <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-colors"
                 >
                   <Icon icon="LogoutIcon" className="inline-block w-5 h-5 mr-2 align-text-bottom" />
                   Logout
                 </button>
               </div>
            </div>

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-500/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Open main menu"
            >
              {isMobileMenuOpen ? <Icon icon="XIcon" className="block h-6 w-6" /> : <Icon icon="MenuIcon" className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md shadow-lg z-40 border-b border-white/20 dark:border-neutral-700/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS_LOGGED_IN.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-500/10 hover:text-neutral-900 dark:hover:text-white'
                  }`
                }
              >
                {item.icon && <Icon icon={item.icon as IconType} className="inline-block w-5 h-5 mr-2 align-text-bottom" />}
                {item.name}
              </NavLink>
            ))}
            <div className="border-t border-neutral-300/50 dark:border-neutral-700/50 pt-4 pb-2">
                 <div className="relative mx-2 mb-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon="SearchIcon" className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <input
                    type="search"
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300/70 dark:border-neutral-600/70 rounded-md leading-5 bg-white/50 dark:bg-neutral-700/50 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-neutral-800 dark:text-neutral-100 transition-colors"
                    placeholder="Search AI models..."
                  />
                </div>
                 <div className="flex items-center px-3 py-2 text-base font-medium rounded-md text-neutral-700 dark:text-neutral-200">
                     {currentUser?.photoURL ? (
                        <img src={currentUser.photoURL} alt="User" className="h-8 w-8 rounded-full mr-3" />
                     ) : (
                        <Icon icon="UserCircleIcon" className="h-8 w-8 mr-3" />
                     )}
                     <span>{userName}</span>
                 </div>
                 <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center px-3 py-2 text-base font-medium rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-colors"
                 >
                   <Icon icon="LogoutIcon" className="w-5 h-5 mr-2" />
                   Logout
                 </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;