const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set the target project folder
const destinationPath = path.join(__dirname, '..', 'public', 'images');

// Check whether the target path exists
if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
}

/**
 * A target folder for saving the uploaded files was specified, 
 * and a mechanism was defined to generate a unique file name (using a timestamp and a random number) to prevent file duplication.
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, 'event-' + uniqueSuffix + extension);
    }
});

module.exports = multer({ storage: storage });