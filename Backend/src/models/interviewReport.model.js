const mongoose = require('mongoose');

// 1. Define Sub-schemas for the AI generated arrays
// _id is set to false to save storage, as these nested items don't need their own database IDs
const technicalQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true }
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String }]
}, { _id: false });

// NEW: Define the Proof of Work sub-schema
const proofOfWorkProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    businessValue: { type: String, required: true },
    architecture: { type: String, required: true },
    techStack: [{ type: String }],
    estimatedTime: { type: String, required: true }
}, { _id: false });


// 2. Define the Main Interview Report Schema
const interviewReportSchema = new mongoose.Schema({
    // Links the report to the logged-in user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    // The title field added to show the job role on the frontend
    title: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    resume: {
        type: String // Optional: User might only provide a self description
    },
    selfDescription: {
        type: String // Optional: User might only provide a resume
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    // Embed the sub-schemas defined above
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    
    // NEW: Embed the Proof of Work projects array
    proofOfWorkProjects: [proofOfWorkProjectSchema]
}, { timestamps: true });

// 3. Create and Export the Model
const InterviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReportModel;