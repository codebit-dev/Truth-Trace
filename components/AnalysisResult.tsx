
import React from 'react';
import type { AnalysisResultType } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon, AnalyzingIcon } from './icons';

interface AnalysisResultProps {
  result: AnalysisResultType | null;
  isLoading: boolean;
}

const VerdictDisplay: React.FC<{ result: AnalysisResultType }> = ({ result }) => {
  const { verdict, confidence } = result;
  
  const getVerdictStyles = () => {
    switch (verdict) {
      case 'Real':
        return {
          icon: <CheckCircleIcon className="h-8 w-8 text-green-400" />,
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30',
          progressColor: 'bg-green-500',
        };
      case 'AI Generated/Manipulated':
        return {
          icon: <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />,
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          progressColor: 'bg-red-500',
        };
      case 'Uncertain':
      default:
        return {
          icon: <QuestionMarkCircleIcon className="h-8 w-8 text-yellow-400" />,
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/30',
          progressColor: 'bg-yellow-500',
        };
    }
  };

  const styles = getVerdictStyles();

  return (
    <div className={`p-6 rounded-lg border ${styles.borderColor} ${styles.bgColor}`}>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-grow text-center md:text-left">
          <h3 className={`text-2xl font-bold ${styles.textColor}`}>{verdict}</h3>
          <p className="text-brand-text-secondary">Confidence Score</p>
        </div>
        <div className="w-full md:w-auto flex items-center space-x-4">
            <div className="w-full md:w-48 bg-brand-primary h-2.5 rounded-full overflow-hidden">
                <div className={`${styles.progressColor} h-2.5 rounded-full`} style={{ width: `${confidence}%` }}></div>
            </div>
            <span className={`text-xl font-semibold ${styles.textColor}`}>{confidence}%</span>
        </div>
      </div>
    </div>
  );
};

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-10 border-t border-brand-border text-center flex flex-col items-center justify-center min-h-[20rem]">
        <AnalyzingIcon />
        <p className="mt-4 text-lg font-medium text-brand-text-secondary">Analyzing media...</p>
        <p className="text-sm text-brand-text-secondary/70">Performing deep forensic scan. Please wait.</p>
      </div>
    );
  }
  
  if (!result) {
    return null;
  }

  return (
    <div className="p-6 border-t border-brand-border">
      <h2 className="text-2xl font-bold mb-4 text-brand-text-primary">Analysis Result</h2>
      <div className="space-y-6">
        <VerdictDisplay result={result} />
        <div>
          <h4 className="text-lg font-semibold mb-3 text-brand-text-primary">Forensic Breakdown</h4>
          <ul className="space-y-2 list-disc list-inside text-brand-text-secondary">
            {result.analysis.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
