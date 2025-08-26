
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResultType } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    verdict: {
      type: Type.STRING,
      description: "A clear verdict: 'Real Image', 'Potential Deepfake', or 'Uncertain'.",
      enum: ['Real Image', 'Potential Deepfake', 'Uncertain'],
    },
    confidence: {
      type: Type.NUMBER,
      description: "A confidence score from 0 to 100 for the verdict.",
    },
    analysis: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "A detailed analysis explaining the reasoning in bullet points. Focus on artifacts, inconsistencies in lighting, shadows, skin texture, hair, eyes, and background.",
    },
  },
  required: ["verdict", "confidence", "analysis"],
};

const PROMPT = `You are a world-class expert in digital forensics and deepfake detection. Your task is to meticulously analyze the provided image for any signs of AI-generation or digital manipulation. 

Examine the following aspects:
- **Facial Features:** Look for unnatural symmetry, inconsistent blinking, smooth skin with no pores, and weird hair strands.
- **Lighting and Shadows:** Check for inconsistent light sources and shadows that don't match the environment.
- **Background Details:** Look for distorted or illogical background elements.
- **Artifacts:** Identify any unusual digital artifacts, blurring, or pixelation, especially around edges.

Based on your expert analysis, provide a structured JSON response with your findings.`;

export const analyzeImageWithGemini = async (
  imageData: { data: string; mimeType: string }
): Promise<AnalysisResultType> => {
  const imagePart = {
    inlineData: {
      data: imageData.data,
      mimeType: imageData.mimeType,
    },
  };

  const textPart = {
    text: PROMPT,
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Basic validation to ensure the result matches the expected structure
    if (result && typeof result.verdict === 'string' && typeof result.confidence === 'number' && Array.isArray(result.analysis)) {
        return result as AnalysisResultType;
    } else {
        throw new Error("Invalid response structure from Gemini API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
