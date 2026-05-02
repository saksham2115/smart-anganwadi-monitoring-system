const { GoogleGenAI } = require('@google/genai');

const aiService = {
    async generateQuiz(examName, topic, difficulty) {
        try {
            // Using placeholder or mock if API key is not present
            if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
                console.log("Using mock data since GEMINI_API_KEY is not set properly.");
                return this.getMockQuiz(examName, topic);
            }

            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            const prompt = `Generate a multiple-choice quiz for the ${examName} exam on the topic of "${topic}" with a ${difficulty} difficulty level.
            Provide 5 questions.
            Return ONLY a JSON array of objects. Do not include markdown code blocks, just raw JSON.
            Each object must have exactly these keys:
            - question: The question text.
            - options: An array of 4 possible answer strings.
            - correctAnswer: The correct answer string (must exactly match one of the options).
            - explanation: A brief explanation of why the answer is correct.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            let text = response.text;
            // Clean up possible markdown wrappers
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const questions = JSON.parse(text);
            return questions;
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw new Error("Failed to generate quiz");
        }
    },

    getMockQuiz(examName, topic) {
        return [
            {
                question: `Mock Question 1 for ${examName} - ${topic}?`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: "Option A",
                explanation: "Because A is the mock correct answer."
            },
            {
                question: `Mock Question 2 for ${examName} - ${topic}?`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: "Option B",
                explanation: "Because B is the mock correct answer."
            }
        ];
    }
};

module.exports = aiService;
