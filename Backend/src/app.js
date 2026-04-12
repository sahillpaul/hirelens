const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// 1. Require Routers
const authRouter = require('./routes/auth.routes.js');
const interviewRouter = require('./routes/interview.routes.js'); // <-- NEW: Imported the interview router

const app = express();

const allowedOrigins = [
    'http://localhost:5173', // Your local Vite server
    process.env.FRONTEND_URL // We will set this in Render later!
];

// 2. Global Middlewares
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies from incoming requests

// 3. Registering Routers with Prefixes
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter); // <-- NEW: Registered the interview router

// 4. Export the app instance
module.exports = app;