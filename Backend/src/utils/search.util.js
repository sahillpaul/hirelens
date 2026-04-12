const axios = require('axios');

/**
 * An independent utility to research a company's technical challenges.
 * It degrades gracefully (returns empty string) if it fails, preventing server crashes.
 */
const performCompanyResearch = async (jobDescription) => {
    try {
        // We look for the API key in your .env file
        const TAVILY_API_KEY = process.env.TAVILY_API_KEY; 

        // SAFETY NET: If no key is found, safely abort the search
        if (!TAVILY_API_KEY) {
            console.log("⚠️ No Search API key found. Defaulting to AI Detective Mode.");
            return ""; 
        }

        console.log("🔍 Initializing Agentic Web Research...");
        
        // Extract a crude company name or context from the JD to search
        // (In a production app, we would use an LLM to extract just the name, but this works for the MVP)
        const query = "latest engineering technical challenges scaling infrastructure blog";

        // Call the Tavily API (Built specifically for LLM research)
        const response = await axios.post('https://api.tavily.com/search', {
            api_key: TAVILY_API_KEY,
            query: `Based on this job description: ${jobDescription.substring(0, 100)}... ${query}`,
            search_depth: "basic",
            include_answer: false,
            max_results: 3
        });

        // If we get good results, combine them into a single paragraph
        if (response.data && response.data.results) {
            console.log("✅ Live Research acquired.");
            return response.data.results.map(r => r.content).join(" ");
        }

        return "";
    } catch (error) {
        // If the API is down, rate-limited, or fails, we catch it here and return a safe empty string
        console.error("❌ Research Engine Error (Safely Ignored):", error.message);
        return ""; 
    }
};

module.exports = { performCompanyResearch };