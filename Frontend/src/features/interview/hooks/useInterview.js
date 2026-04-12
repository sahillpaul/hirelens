import { useContext } from 'react';
import { InterviewContext } from '../interview.context.jsx';
import { 
    generateInterviewReport, 
    getInterviewReportById, 
    getAllInterviewReports 
} from '../services/interview.api.js';

export const useInterview = () => {
    // 1. Extract states and setters from the Context (State Layer)
    const context = useContext(InterviewContext);
    
    // Safety check
    if (!context) {
        throw new Error("useInterview must be used within InterviewProvider");
    }

    const { 
        loading, setLoading, 
        report, setReport, 
        reports, setReports 
    } = context;

    // 2. Function to generate a new AI interview report
    const generateReport = async (jobDescription, selfDescription, resumeFile) => {
        setLoading(true);
        try {
            const data = await generateInterviewReport(jobDescription, selfDescription, resumeFile);
            // Sets the report data into the global state
            setReport(data.interviewReport || data);
            return data.interviewReport || data; 
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Function to fetch a specific report by its ID
    const getReportById = async (interviewId) => {
        setLoading(true);
        try {
            const data = await getInterviewReportById(interviewId);
            setReport(data);
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // 4. Function to fetch all past reports for the user
    const getReports = async () => {
        setLoading(true);
        try {
            const data = await getAllInterviewReports();
            setReports(data);
            return data;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // 5. Expose the states and functions to be used in UI components (like Home.jsx)
    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports
    };
};