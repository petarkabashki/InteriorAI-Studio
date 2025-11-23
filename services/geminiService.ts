import { GoogleGenAI } from "@google/genai";

// Guideline: Use 'gemini-2.5-flash-image' for General Image Generation and Editing Tasks
const MODEL_NAME = 'gemini-2.5-flash-image';

// Guideline: API key must be obtained from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Sends an image and a text prompt to Gemini to edit the image.
 * 
 * @param base64Image The base64 encoded string of the source image.
 * @param mimeType The mime type of the source image.
 * @param prompt The user's instruction for editing.
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    // Guideline: To edit images, prompt with text, images, or both.
    // Construct the parts array with the image data and the text prompt.
    const parts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
      {
        text: prompt,
      },
    ];

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      // Note: responseMimeType and responseSchema are not supported for nano banana series models.
    });

    // Guideline: Iterate through all parts to find the image part. Do not assume position.
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          // Found the image
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};