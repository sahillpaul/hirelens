const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// 1. Require Routers
const authRouter = require('./routes/auth.routes.js');
const interviewRouter = require('./routes/interview.routes.js'); 

const app = express();

// 🚨 FIX 1: Added https:// to the Vercel link (This was causing the crash!)
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://hirelens-eta.vercel.app' 
];

// 2. Global Middlewares
// 🚨 FIX 2: Added the logging CORS setup
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Vercel proxies)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            // This prints the EXACT blocked link to Render so we don't have to guess
            console.error("🚨 CORS BLOCKED THIS ORIGIN:", origin); 
            return callback(new Error('Not allowed by CORS'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies from incoming requests

// 3. Registering Routers with Prefixes
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter); 

// 4. Export the app instance
module.exports = app;