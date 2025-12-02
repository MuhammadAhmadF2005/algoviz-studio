import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt } from "./dsa-knowledge";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not defined - AI features will be limited");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: systemPrompt,
});

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!model) {
    return "AI assistant is not configured. Please add your Gemini API key.";
  }

  try {
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error sending message to AI:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};
