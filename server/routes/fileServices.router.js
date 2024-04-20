const express = require('express');
const router = express.Router();
const controller = require('../controllers/fileServices.controller');
const authorizeToken = require('../middlewares/authentication');
const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });


router.route('/getFiles').get(authorizeToken, controller.getFiles);
router.route('/downloadFile/:filename').get(authorizeToken, controller.downloadFile);
router.route('/uploadFile').post(authorizeToken, upload.single('file'), controller.uploadFile);
router.route('/removeFile/:filename').delete(authorizeToken, controller.removeFile);

module.exports = router; 