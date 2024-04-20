const logger = require('../../config/logger');
const fileService = require('../services/fileServices');
const path = require('path');


const getFiles = (req, res, next) => {
    fileService.getFiles().then(data => {
        res.status(200).json({ "success": true, "data": data });
    })
}

const downloadFile = (req, res) => {
    const filename = req.params.filename;
    const directoryPath = __dirname + '../../../uploads/'; // Adjust based on where your files are stored
    const filePath = directoryPath + filename;

    res.download(filePath, filename, (err) => {
        if (err) {
            // Handle error, but don't expose to the client
            console.log(err); // For server-side logging
            res.status(500).send('File could not be downloaded.');
        }
    });
}

const removeFile = (req, res) => {
    const { filename } = req.params;

    const directoryPath = path.resolve(__dirname + '../../../uploads'); // Adjust based on where your files are stored
    const filePath = directoryPath + '/' + filename;

    fileService.removeFile(filename, filePath).then(data => {
        res.status(200).json({ 'success': true, 'data': data });

    }).catch(err => {
        res.status(401).json({ 'error': err });
    })
}

const uploadFile = (req, res) => {
    logger.info(req.body);
    let fileDetails = req.file;
    // console.log(userDetails, 'userDetails----------------------->');
    fileService.uploadFile(fileDetails).then(data => {
        res.status(200).json({ 'success': true, 'data': data });
    }).catch(err => {
        res.status(401).json({ 'error': err });
    })
}


module.exports = {
    getFiles,
    downloadFile,
    uploadFile,
    removeFile
}