
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv'; // Import dotenv

// Explicitly load environment variables from .env file
// This is helpful especially if this module is imported in different contexts.
// Next.js also loads .env, but this ensures it for any direct script use too.
config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  // This warning will appear in your server console if the key is missing
  console.warn(
    '\x1b[33m%s\x1b[0m', // Yellow color for warning
    'WARNING: GOOGLE_API_KEY is not set in your .env file or deployment environment. ' +
    'AI features will likely fail. Please obtain a key from Google AI Studio (https://aistudio.google.com/app/apikey) ' +
    'and add it as GOOGLE_API_KEY="YOUR_KEY_HERE" in your .env file, then restart your server.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey, // Explicitly pass the API key
    }),
  ],
  model: 'googleai/gemini-2.0-flash', // Default text model for the application
});
