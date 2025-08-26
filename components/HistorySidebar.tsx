
import React from 'react';
import type { HistoryItem } from '../types';
import { CloseIcon, ExclamationTriangleIcon, CheckCircleIcon, QuestionMarkCircleIcon, TrashIcon, VideoIcon, AudioIcon, PhotoIcon } from './icons';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const VerdictIcon: React.FC<{verdict: string}> = ({verdict}) => {
    switch(verdict) {
        case 'Real': return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
        case 'AI Generated/Manipulated': return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
        default: return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-400" />;
    }
}

const MediaPreview: React.FC<{item: HistoryItem}> = ({ item }) => {
  const baseClasses = "w-16 h-16 rounded-md object-cover flex-shrink-0 bg-brand-primary";
  switch (item.mediaType) {
    case 'image':
      return <img src={item.mediaUrl} alt={item.fileName} className={baseClasses} />;
    case 'video':
      return <video src={item.mediaUrl} className={baseClasses} muted playsInline />;
    case 'audio':
      return <div className={`${baseClasses} flex items-center justify-center`}><AudioIcon className="h-8 w-8 text-brand-text-secondary" /></div>;
    default:
      return <div className={`${baseClasses} flex items-center justify-center`}><PhotoIcon className="h-8 w-8 text-brand-text-secondary" /></div>;
  }
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-secondary border-l border-brand-border z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-heading"
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-border">
          <h2 id="history-heading" className="text-xl font-semibold">Analysis History</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-brand-border transition-colors" aria-label="Close history panel">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-122px)]">
          {history.length === 0 ? (
            <div className="text-center text-brand-text-secondary pt-20 px-4">
              <p>Your analyzed media will appear here.</p>
            </div>
          ) : (
            <ul className="space-y-3 p-4">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSelect(item)}
                    className="w-full flex items-center p-3 rounded-lg bg-brand-primary hover:bg-brand-border transition-colors border border-brand-border text-left"
                  >
                    <MediaPreview item={item} />
                    <div className="ml-4 flex-grow overflow-hidden">
                      <p className="font-semibold text-sm text-brand-text-primary truncate" title={item.fileName}>{item.fileName}</p>
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
        <div className="p-4 border-t border-brand-border">
            <button
                onClick={onClear}
                disabled={history.length === 0}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors duration-200 border border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <TrashIcon className="h-5 w-5" />
                <span>Clear History</span>
            </button>
        </div>
      </aside>
    </>
  );
};
