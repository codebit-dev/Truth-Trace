
export interface AnalysisResultType {
  verdict: 'Real Image' | 'Potential Deepfake' | 'Uncertain';
  confidence: number;
  analysis: string[];
}

export interface HistoryItem {
  id: string;
  image: string; // base64 data URL
  result: AnalysisResultType;
}
