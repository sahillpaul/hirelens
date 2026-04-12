const multer = require('multer');

// Configure Multer to hold the file in RAM with a 3MB limit
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3 MB in bytes
    }
});

module.exports = upload;