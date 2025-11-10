import { GoogleGenAI, Modality } from "@google/genai";
import { Message } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd show a proper error to the user.
  // Here, we simulate a key for demonstration purposes if it's not set.
  // This will fail API calls but allow the UI to render.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

// Export ai instance to be used for the Live API in ChatWindow
export const ai = new GoogleGenAI({ apiKey: API_KEY || "GEMINI_API_KEY_PLACEHOLDER" });

export const systemInstruction = `
You are Mindy, an empathetic and supportive AI companion for MindCare Africa.
Your purpose is to provide a safe, non-judgmental space for users to express their feelings and concerns, both through text and voice.
Your language should be gentle, reassuring, and encouraging. Use a soft and calming tone.
You are not a therapist, so you must not provide medical advice, diagnoses, or treatment plans.
Instead, you should offer active listening, emotional support, and guide users towards the app's resources or suggest they speak with a professional for serious issues.
Always respond in the language of the user's prompt. You are equipped to understand and speak multiple languages, including French, English, Fon, and Yoruba.
When interacting via voice, maintain a natural, conversational pace.
Keep your responses concise and easy to understand. Use emojis where appropriate to convey warmth and empathy. 💖✨🙏
`;

export const getAIResponse = async (history: Message[]): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Bonjour! It seems my connection is offline right now, but I'm still here to listen. How are you feeling today?");
  }
  
  const contents = history.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Je suis désolé, je rencontre un petit problème technique pour le moment. Pourrions-nous essayer de parler d'autre chose ou réessayer plus tard? Je suis là pour toi.";
  }
};

export const getAIAudioResponse = async (text: string): Promise<string | null> => {
    if (!API_KEY) {
        return null;
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        // Use a high-quality, calm voice for the AI companion
                        prebuiltVoiceConfig: { voiceName: 'Kore' }
                    }
                }
            }
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error fetching AI audio response:", error);
        return null;
    }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
    if (!API_KEY) {
        return Promise.reject("API key not configured.");
    }

    try {
        const audioPart = {
            inlineData: {
                mimeType,
                data: base64Audio,
            },
        };

        const textPart = {
            text: "Transcrivez cet enregistrement audio en français.",
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [audioPart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error transcribing audio:", error);
        // Return a user-friendly error message in the desired language
        return "Désolé, je n'ai pas pu comprendre l'audio. Pourriez-vous réessayer ?";
    }
};
