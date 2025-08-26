
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { HistorySidebar } from './components/HistorySidebar';
import { analyzeImageWithGemini } from './services/geminiService';
import type { AnalysisResultType, HistoryItem } from './types';

const App: React.FC = () => {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
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
    if (history.length > 0) {
      localStorage.setItem('deepfake-history', JSON.stringify(history));
    }
  }, [history]);

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImage({ file, url: imageUrl });
    setAnalysisResult(null);
    setError(null);
    handleAnalysis(file, imageUrl);
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

  const handleAnalysis = useCallback(async (file: File, imageUrl: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const base64Data = await fileToBase64(file);
      const mimeType = file.type;
      const result = await analyzeImageWithGemini({ data: base64Data, mimeType });

      setAnalysisResult(result);
      
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        image: imageUrl,
        result: result,
      };
      setHistory(prevHistory => [newHistoryItem, ...prevHistory.slice(0, 49)]);

    } catch (e) {
      console.error(e);
      setError('Failed to analyze the image. The AI model may be unavailable or the image format is not supported. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleHistorySelect = (item: HistoryItem) => {
    setImage({ file: new File([], "history_image"), url: item.image });
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
            AI-Powered DeepFake Detection
          </h1>
          <p className="text-lg text-brand-text-secondary max-w-2xl mb-8">
            Upload an image to scan for signs of digital manipulation and AI generation. Get a detailed forensic analysis in seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-brand-secondary rounded-xl border border-brand-border shadow-2xl overflow-hidden">
          <ImageUploader onImageSelect={handleImageSelect} isAnalyzing={isLoading} currentImage={image?.url} />
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
      />
    </div>
  );
};

export default App;
