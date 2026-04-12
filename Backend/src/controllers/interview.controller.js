const InterviewReportModel = require('../models/interviewReport.model.js');
const { generateInterviewReport } = require('../services/ai.service.js');
const pdfParse = require('pdf-parse'); 

// 1. Generate Interview Report
const generateInterviewReportController = async (req, res) => {
    try {
        const { selfDescription, jobDescription } = req.body;
        let resumeContent = "";

        // THE FIX: Safely check if a file was actually uploaded before trying to read the buffer
        if (req.file && req.file.buffer) {
            try {
                const uint8Array = Uint8Array.from(req.file.buffer);
                
                // Restored the tutor's logic to prevent the "not a function" error
                const PDFParserClass = pdfParse.pdfParse || pdfParse.PDFParse || pdfParse;
                const pdfInstance = new PDFParserClass(uint8Array);
                const pdfData = await pdfInstance.getText();
                resumeContent = pdfData.text || pdfData;
            } catch (pdfError) {
                console.error("PDF Parsing Error:", pdfError);
                return res.status(400).json({ message: "Failed to parse the uploaded PDF." });
            }
        }

        // SAFETY NET: Ensure we have at least SOME data to send to Gemini
        if (!resumeContent && !selfDescription) {
            return res.status(400).json({ message: "You must provide either a resume or a self-description." });
        }

        // Send the extracted text and descriptions to your AI service
        const interviewReportByAI = await generateInterviewReport(
            resumeContent, 
            selfDescription, 
            jobDescription
        );

        // Save the result to the MongoDB database
        const interviewReport = await InterviewReportModel.create({
            user: req.user.id, 
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAI
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2. NEW: Get Interview Report by ID
const getInterviewReportByIdController = async (req, res) => {
    try {
        // Extracts the interviewId from the URL parameters
        const { interviewId } = req.params;
        
        // Fetches the specific report from the database
        const interviewReport = await InterviewReportModel.findById(interviewId);
        
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }
        
        res.status(200).json(interviewReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 3. NEW: Get All Interview Reports for the Logged-in User
const getAllInterviewReportsController = async (req, res) => {
    try {
        // Fetches all reports belonging to the current user
        // OPTIMIZATION: Uses .select() to exclude heavy fields that aren't needed for the basic list
        const interviewReports = await InterviewReportModel.find({ user: req.user.id })
            .select('-resume -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan');
            
        res.status(200).json(interviewReports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController
};