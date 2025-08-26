import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MediaUploader } from './components/MediaUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { HistorySidebar } from './components/HistorySidebar';
import { analyzeMedia } from './services/geminiService';
import type { AnalysisResultType, HistoryItem } from './types';

type MediaType = 'image' | 'video' | 'audio';

const App: React.FC = () => {
  const [media, setMedia] = useState<{ file: File; url: string; type: MediaType } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('deepfake-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('deepfake-history');
    }
  }, []);

  useEffect(() => {
    // Prevent saving empty history on initial load
    if (history.length > 0 || localStorage.getItem('deepfake-history') !== null) {
       localStorage.setItem('deepfake-history', JSON.stringify(history));
    }
  }, [history]);

  const handleMediaSelect = (file: File, type: MediaType) => {
    const mediaUrl = URL.createObjectURL(file);
    setMedia({ file, url: mediaUrl, type });
    setAnalysisResult(null);
    setError(null);
    handleAnalysis(file, mediaUrl, type);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // remove data:mime/type;base64, part
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalysis = useCallback(async (file: File, mediaUrl: string, type: MediaType) => {
    setIsLoading(true);
    setError(null);
    try {
      const base64Data = await fileToBase64(file);
      const mimeType = file.type;
      const result = await analyzeMedia({ data: base64Data, mimeType, type });

      setAnalysisResult(result);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        mediaUrl: mediaUrl,
        mediaType: type,
        fileName: file.name,
        result: result,
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, 49)]);

    } catch (e) {
      console.error(e);
      setError('Failed to analyze the media. The AI model may be unavailable or the file format is not supported. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleHistorySelect = (item: HistoryItem) => {
    // We can't recreate the file object, but we can display the media and result
    setMedia({ file: new File([], item.fileName), url: item.mediaUrl, type: item.mediaType });
    setAnalysisResult(item.result);
    setIsHistoryOpen(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-brand-primary text-brand-text-primary font-sans">
      <Header onHistoryClick={() => setIsHistoryOpen(true)} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            AI-Powered Media Forensics
          </h1>
          <p className="text-lg text-brand-text-secondary max-w-2xl mb-8">
            Upload an image, video, or audio file to scan for signs of digital manipulation and AI generation. Get a detailed analysis in seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-brand-secondary rounded-xl border border-brand-border shadow-2xl overflow-hidden">
          <MediaUploader onMediaSelect={handleMediaSelect} isAnalyzing={isLoading} currentMedia={media} />
          {error && (
            <div className="p-6 border-t border-brand-border bg-red-900/20 text-red-300 text-center">
              <p><strong>Analysis Error:</strong> {error}</p>
            </div>
          )}
          <AnalysisResult result={analysisResult} isLoading={isLoading} />
        </div>
      </main>
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onClear={() => {
          setHistory([]);
          localStorage.removeItem('deepfake-history');
        }}
      />
    </div>
  );
};

export default App;