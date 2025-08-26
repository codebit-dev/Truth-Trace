
import React from 'react';
import { HistoryIcon, ShieldIcon } from './icons';

interface HeaderProps {
  onHistoryClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="bg-brand-secondary/80 backdrop-blur-lg sticky top-0 z-20 border-b border-brand-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <ShieldIcon className="h-8 w-8 text-brand-accent" />
            <span className="text-xl font-semibold text-brand-text-primary tracking-wider">
              DeepFake Detector
            </span>
          </div>
          <button
            onClick={onHistoryClick}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-brand-text-primary bg-brand-secondary hover:bg-brand-border transition-colors duration-200 border border-brand-border"
          >
            <HistoryIcon className="h-5 w-5" />
            <span>History</span>
          </button>
        </div>
      </div>
    </header>
  );
};
