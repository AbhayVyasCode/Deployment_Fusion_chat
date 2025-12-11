import geminiResponse from '../lib/gemini.js';
import moment from 'moment';

export const askAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = req.user;

        if (!command) {
            return res.status(400).json({ error: "Command is required." });
        }

        const result = await geminiResponse(command, user.assistantName || "FusionAI", user.fullName);

        const cleanedString = result.response.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanedString.match(/{[\s\S]*}/);

        if (!jsonMatch) {
            console.error("No JSON object found in Gemini response:", cleanedString);
            return res.status(500).json({ response: "Sorry, I couldn't structure a response." });
        }

        const gemResult = JSON.parse(jsonMatch[0]);
        
        // --- This is the new logic block to add URLs ---
        let responsePayload = { ...gemResult };

        switch (gemResult.type) {
            case 'get_date':
                responsePayload.response = `The current date is ${moment().format("MMMM Do YYYY")}`;
                break;
            case 'get_time':
                responsePayload.response = `The current time is ${moment().format("h:mm A")}`;
                break;
            case 'google_search':
                responsePayload.url = `https://www.google.com/search?q=${encodeURIComponent(gemResult.userInput)}`;
                break;
            case 'youtube_search':
                responsePayload.url = `https://www.youtube.com/results?search_query=${encodeURIComponent(gemResult.userInput)}`;
                break;
            case 'youtube_play':
                // For simplicity, this also just searches. A more advanced version could find and embed the first video.
                responsePayload.url = `https://www.youtube.com/results?search_query=${encodeURIComponent(gemResult.userInput)}`;
                break;
            case 'calculator_open':
                // The best cross-platform way to "open" a calculator is to search for one.
                responsePayload.url = `https://www.google.com/search?q=calculator`;
                responsePayload.response = "Opening a calculator for you.";
                break;
            case 'instagram_open':
                responsePayload.url = `https://www.instagram.com`;
                break;
            case 'facebook_open':
                responsePayload.url = `https://www.facebook.com`;
                break;
        }

        return res.json(responsePayload);

    } catch (error) {
        console.error("Ask assistant error:", error.message);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
};
