const multer = require('multer')
const path = require('path');
// const { HttpError } = require('../helpers/HttpErrors');

const destination = path.join(__dirname, '../../', 'tmp');

const storage = multer.diskStorage({
    destination, 
    filename: (req, file, cb) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`
        const filename = `${uniquePrefix}_${file.originalname}`;
        cb(null, filename);
    },
})
const limits = {
    fileSize: 5 * 1024 * 1024,
};

// const fileFilter = (req, file, cb) => {
//     const extention = file.originalname.split(".").pop();
//     if(extention === "exe") {
//         return cb(new HttpError(400, "Invalid file extention"));
//     }
//     cb(null, true);
// }

const upload = multer({
    storage,
    limits,
    // fileFilter,
})

module.exports = upload;