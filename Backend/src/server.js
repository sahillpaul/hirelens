// 1. MUST BE FIRST: Load environment variables before anything else needs them
require('dotenv').config();

// 2. App and DB (Next door in the same 'src' folder)
const app = require('./app');
const connectToDB = require('./config/database');

// 4. Start the server
const PORT= process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 5. Connect to the database
connectToDB();