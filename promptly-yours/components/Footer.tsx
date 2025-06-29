
import React from 'react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border-t border-white/20 dark:border-neutral-700/30 shadow-top-md">
      <div className="container mx-auto px-4 py-8 text-center text-neutral-600 dark:text-neutral-400">
        <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
        <p className="text-sm mt-1">AI-Powered Solutions, On Demand.</p>
        <div className="mt-4 space-x-4">
            <a href="#privacy" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;