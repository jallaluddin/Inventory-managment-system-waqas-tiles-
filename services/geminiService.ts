
import { GoogleGenAI } from "@google/genai";

// Ensure API_KEY is set in your environment variables for this to work.
// For this example, we'll proceed assuming it's available.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.warn("Gemini API key not found. AI features will be disabled. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generateTileDescription = async (tileName: string): Promise<string> => {
    if (!apiKey) {
        return "AI description generation is disabled. API key not configured.";
    }

    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a concise, appealing, one-sentence product description for a tile named "${tileName}".`,
            config: {
                temperature: 0.7,
                maxOutputTokens: 50,
            }
        });
        return result.text;
    } catch (error) {
        console.error("Error generating tile description:", error);
        return "Could not generate AI description at this time.";
    }
};
