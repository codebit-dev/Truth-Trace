
import type { AnalysisResultType } from '../types';

// Mock analysis function to simulate AI response for IMAGES
const generateMockImageAnalysis = (): AnalysisResultType => {
  const random = Math.random();
  if (random < 0.45) {
    return {
      verdict: 'Real',
      confidence: Math.floor(Math.random() * 20) + 80, // 80-99
      analysis: [
        "Consistent lighting and shadows observed across the subject and background.",
        "Skin texture appears natural with visible pores and minor imperfections.",
        "No unusual digital artifacts or blurring detected around the edges.",
        "Eye reflections and details appear consistent and natural.",
      ],
    };
  } else if (random < 0.9) {
    return {
      verdict: 'AI Generated/Manipulated',
      confidence: Math.floor(Math.random() * 30) + 70, // 70-99
      analysis: [
        "Inconsistent shadows detected on the left side of the face.",
        "Unnatural smoothness in skin texture, lacking typical pores or blemishes.",
        "Minor blurring and artifacts visible around the hairline upon close inspection.",
        "The background appears slightly distorted near the subject's shoulder.",
      ],
    };
  } else {
    return {
      verdict: 'Uncertain',
      confidence: Math.floor(Math.random() * 40) + 30, // 30-69
      analysis: [
        "Image quality is too low for a conclusive analysis.",
        "Heavy compression artifacts obscure fine details needed for verification.",
        "Could not find strong evidence for either manipulation or authenticity.",
      ],
    };
  }
};

// Mock analysis function to simulate AI response for VIDEOS
const generateMockVideoAnalysis = (): AnalysisResultType => {
  const random = Math.random();
  if (random < 0.5) {
      return {
          verdict: 'Real',
          confidence: Math.floor(Math.random() * 15) + 85, // 85-99
          analysis: [
              "Consistent frame-to-frame lighting and object positioning.",
              "Audio is perfectly synchronized with lip movements.",
              "No evidence of morphing artifacts or deepfake markers found.",
              "Background elements remain stable and consistent throughout.",
          ],
      };
  } else {
      return {
          verdict: 'AI Generated/Manipulated',
          confidence: Math.floor(Math.random() * 25) + 75, // 75-99
          analysis: [
              "Detected minor lip-sync discrepancies in later half of the video.",
              "Unnatural 'blinking' patterns observed, inconsistent with human behavior.",
              "Slight visual warping artifacts detected around the subject's face during movement.",
              "Audio analysis reveals subtle non-human frequency patterns.",
          ],
      };
  }
};

// Mock analysis function to simulate AI response for AUDIO
const generateMockAudioAnalysis = (): AnalysisResultType => {
  const random = Math.random();
  if (random < 0.5) {
      return {
          verdict: 'Real',
          confidence: Math.floor(Math.random() * 10) + 90, // 90-99
          analysis: [
              "Consistent vocal patterns and breathing sounds detected.",
              "Background noise is natural and consistent with the recording environment.",
              "Frequency analysis shows no signs of synthetic voice generation.",
              "Speech cadence and intonation are within normal human ranges.",
          ],
      };
  } else {
      return {
          verdict: 'AI Generated/Manipulated',
          confidence: Math.floor(Math.random() * 20) + 80, // 80-99
          analysis: [
              "Identified spectral artifacts common in voice cloning models.",
              "Lack of typical microscopic variations found in human speech.",
              "Abrupt, unnatural shifts in background noise detected at 0:08s.",
              "Vocal pitch shows an unnaturally consistent and narrow frequency range.",
          ],
      };
  }
};

export const analyzeMedia = async (
  mediaData: { data: string; mimeType: string; type: 'image' | 'video' | 'audio' }
): Promise<AnalysisResultType> => {
  console.log(`Simulating ${mediaData.type} analysis for:`, mediaData.mimeType);
  
  // Simulate network delay to show loading animation
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    let result;
    switch (mediaData.type) {
        case 'video':
            result = generateMockVideoAnalysis();
            break;
        case 'audio':
            result = generateMockAudioAnalysis();
            break;
        case 'image':
        default:
            result = generateMockImageAnalysis();
            break;
    }
    return result;
  } catch (error) {
    console.error("Error generating mock analysis:", error);
    throw new Error("Failed to get a valid response from the mock AI model.");
  }
};
