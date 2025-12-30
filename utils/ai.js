import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';

// Get API key from environment variables
const GEMINI_API_KEY = Constants.expoConfig?.extra?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

console.log('API Key from Constants:', Constants.expoConfig?.extra?.GEMINI_API_KEY);
console.log('API Key from process.env:', process.env.GEMINI_API_KEY);
console.log('Final API Key:', GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Cache to avoid re-processing the same text
const punctuationCache = new Map();
let debounceTimer = null;

export const punctuateText = async (rawText) => {
    if (!rawText || rawText.length < 5) {
        return rawText;
    }

    // Check cache first
    const cacheKey = rawText.trim().toLowerCase();
    if (punctuationCache.has(cacheKey)) {
        return punctuationCache.get(cacheKey);
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `
    You are a text formatting assistant.
    Restore proper punctuation and capitalization to the user's raw speech-to-text input.
    Do not change any words.
    Do not summarize.
    Return ONLY the formatted text.

    Raw Input: "${rawText}"
  `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        // Safely extract the text from Gemini's complex response object
        const punctuatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const result = punctuatedText ? punctuatedText.trim() : rawText;

        // Store in cache (limit cache size to 50 entries)
        if (punctuationCache.size > 50) {
            const firstKey = punctuationCache.keys().next().value;
            punctuationCache.delete(firstKey);
        }
        punctuationCache.set(cacheKey, result);

        return result;

    } catch (error) {
        Alert.alert("Punctuation Error", `Failed to format text: ${error.message}`);
        return rawText; // If AI fails, just save the original text
    }
};

export const transcribeAudio = async (audioUri) => {
    try {
        // Read the audio file as base64
        const audioBase64 = await FileSystem.readAsStringAsync(audioUri, {
            encoding: 'base64',
        });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "Here is an audio file, write down what you hear. Return only the transcribed text with proper punctuation and capitalization.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "audio/m4a", // Assuming m4a format
                    data: audioBase64,
                },
            },
        ]);

        const response = await result.response;
        const transcribedText = response.text().trim();

        return transcribedText;
    } catch (error) {
        Alert.alert("Transcription Error", `Failed to transcribe audio: ${error.message}`);
        throw error;
    }
};

// Debounced version to avoid too many API calls during typing
export const punctuateTextDebounced = (rawText, callback, delay = 1000) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        const result = await punctuateText(rawText);
        callback(result);
    }, delay);
};