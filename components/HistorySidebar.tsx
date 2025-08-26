
import React from 'react';
import type { HistoryItem } from '../types';
import { CloseIcon, ExclamationTriangleIcon, CheckCircleIcon, QuestionMarkCircleIcon } from './icons';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const VerdictIcon: React.FC<{verdict: string}> = ({verdict}) => {
    switch(verdict) {
        case 'Real Image': return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        case 'Potential Deepfake': return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
        default: return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-400" />;
    }
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelect }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-secondary border-l border-brand-border z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-border">
          <h2 className="text-xl font-semibold">Analysis History</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-border transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
          {history.length === 0 ? (
            <div className="text-center text-brand-text-secondary pt-20">
              <p>Your analyzed images will appear here.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect(item)}
                    className="w-full flex items-center p-3 rounded-lg bg-brand-primary hover:bg-brand-border transition-colors border border-brand-border text-left"
                  >
                    <img src={item.image} alt="Analyzed" className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                    <div className="ml-4 flex-grow">
                      <p className="font-semibold text-sm text-brand-text-primary">{new Date(item.id).toLocaleString()}</p>
                      <div className="flex items-center space-x-2 mt-1">
                          <VerdictIcon verdict={item.result.verdict} />
                          <span className="text-sm text-brand-text-secondary">{item.result.verdict}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};
