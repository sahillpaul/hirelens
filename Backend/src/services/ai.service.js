const { GoogleGenAI } = require('@google/genai');

// 1. IMPORT YOUR RESEARCH UTILITY
const { performCompanyResearch } = require('../utils/search.util.js');

// Initialize the AI instance using your API Key
const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY 
});

// 2. UPGRADED Skeleton Template (Pushes AI to generate enterprise-level concepts)
const jsonTemplate = {
    "title": "The exact title of the job role based on the JD", 
    "technicalQuestions": [
        {
            "question": "Write a technical question here based on the JD",
            "intention": "Why are you asking this?",
            "answer": "How should the candidate answer?"
        }
    ],
    "behavioralQuestions": [
        {
            "question": "Write a behavioral question here",
            "intention": "Why are you asking this?",
            "answer": "How should the candidate answer?"
        }
    ],
    "skillGaps": [
        {
            "skill": "Name a missing skill",
            "severity": "High, Medium, or Low"
        }
    ],
    "preparationPlan": [
        {
            "day": 1,
            "focus": "Main topic for the day",
            "tasks": ["Task 1", "Task 2"]
        }
    ],
    // Upgraded Template for Proof of Work
    "proofOfWorkProjects": [
        {
            "title": "High-Level System Name",
            "businessValue": "Explain quantifiable impact.",
            "architecture": "Detail the system design like a FAANG interview.",
            "techStack": ["Redis", "Node.js", "Docker", "AWS ECS"],
            "estimatedTime": "1-2 Weeks (Production-Grade PoC)"
        }
    ],
    "matchScore": 85
};

// 3. The generation function
async function generateInterviewReport(resume, selfDescription, jobDescription) {
    
    // FIRE THE RESEARCH ENGINE BEFORE CALLING GEMINI
    console.log("🔍 Fetching live context for the Job Description...");
    const researchContext = await performCompanyResearch(jobDescription);
    
    // THE UPGRADED PROMPT: Adopting the "Staff Engineer" persona
    const prompt = `You are a strict, elite Staff Engineer at a FAANG company. Generate an interview report.
    
    Candidate Resume: ${resume || "Not provided"}
    Candidate Self Description: ${selfDescription || "Not provided"}
    Target Job Description: ${jobDescription}
    
    LIVE RESEARCH CONTEXT (May be empty): 
    "${researchContext}"

    CRITICAL INSTRUCTION FOR "proofOfWorkProjects":
    You MUST generate 2 highly impressive, production-grade 'Proof of Work' (PoC) systems. 
    THESE CANNOT BE TOY APPS. Do not suggest CRUD apps, basic APIs, or simple dashboards. 
    
    You must suggest complex, architectural systems that solve enterprise-level bottlenecks. 
    Focus on: Distributed caching, message queues (Kafka/RabbitMQ), WebSockets, CI/CD pipelines, database sharding, or performance optimization.

    1. If 'Live Research Context' has data, design a system that explicitly solves their exact current pain points.
    2. If 'Live Research Context' is empty, look at the Job Description's tech stack. Invent a massive scaling problem for that stack, and design a Proof of Work to solve it.
    
    The "businessValue" MUST sound like a senior engineer explaining ROI (Return on Investment) using quantifiable metrics.
    The "architecture" MUST describe the system design flow and specific algorithms used.
    
    CRITICAL INSTRUCTION FOR FORMATTING:
    You MUST return ONLY a valid JSON object. 
    You MUST use the EXACT keys and structure shown in the template below. 
    Do NOT add any extra keys like "interview_evaluation".
    You can generate multiple items for the arrays, but the structure must remain identical.
    
    TEMPLATE TO FILL OUT:
    ${JSON.stringify(jsonTemplate, null, 2)}`;

    try {
        console.log("🧠 Sending context and template to Gemini...");
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: prompt,
            config: {
                // Forces the API to return JSON format
                responseMimeType: 'application/json' 
            }
        });

        // 4. SAFETY NET: Clean the string before parsing
        let rawText = response.text;
        
        // Strip out markdown formatting if Gemini tries to be helpful
        // We use a regex to catch ```json, ```JSON, or just ``` at the start/end
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

        // 5. Parse and return the JSON response
        const parsedReport = JSON.parse(rawText);
        console.log("✅ SUCCESS! AI Output generated perfectly.");
        return parsedReport;

    } catch (error) {
        console.error("❌ AI Generation Failed:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport };