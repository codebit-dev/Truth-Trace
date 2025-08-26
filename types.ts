
export interface AnalysisResultType {
  verdict: 'Real' | 'AI Generated/Manipulated' | 'Uncertain';
  confidence: number;
  analysis: string[];
}

export interface HistoryItem {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio';
  fileName: string;
  result: AnalysisResultType;
}
