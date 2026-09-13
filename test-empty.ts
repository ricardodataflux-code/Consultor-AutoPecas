import { GoogleGenAI } from "@google/genai";
try {
  const ai = new GoogleGenAI({ apiKey: "" });
  console.log("No error on init");
  ai.models.generateContent({ model: 'gemini-1.5-flash', contents: 'hi' })
    .then(console.log)
    .catch(err => console.log("Catch on call:", err.message));
} catch (e) {
  console.log("Error on init:", e);
}
