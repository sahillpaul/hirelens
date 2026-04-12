// Load environment variables (like your API key) if you have them
require('dotenv').config(); 

// Import the specific function we want to test
const { performCompanyResearch } = require('./src/utils/search.util.js');

const runTest = async () => {
    console.log("🚀 Starting Search Utility Test...\n");

    // A dummy job description to test the search
    const dummyJobDescription = "We are Netflix. We are looking for a Senior Backend Engineer to help us build the next generation of our streaming platform. You must have deep experience with Node.js, AWS, and caching huge amounts of data with Redis to reduce latency across global regions.";

    // Run the function
    const result = await performCompanyResearch(dummyJobDescription);

    // Print the results cleanly
    console.log("\n================ TEST RESULTS ================");
    if (result === "") {
        console.log("Result: [EMPTY STRING]");
        console.log("Status: 🛡️ Fallback to 'Detective Mode' triggered successfully.");
        console.log("Reason: You likely don't have a TAVILY_API_KEY in your .env yet, or the API call failed.");
    } else {
        console.log("Result:");
        console.log(result);
        console.log("\nStatus: ✅ Live Research successfully fetched!");
    }
    console.log("==============================================\n");
};

runTest();