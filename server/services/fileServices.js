require('dotenv').config();


const models = require('../../models');
const mongoose = require('mongoose');
const logger = require('../../config/logger');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const allUsers = require('../../assets/users/admins');
const multer = require('multer');
const fs = require('fs-extra');



const getFiles = () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("get event functions");
            let users = await models.file.find();
            resolve(users);
        } catch (err) {
            console.log(err);
            reject({ code: 401, message: err.message });
        }

    })

}

const uploadFile = (fileDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const file = fileDetails;
            if (!file) {
                reject({ code: 400, message: 'No file uploaded.' });
                return;
            }
            console.log(file, 'file');

            // Create a new file document using the file details
            const newFile = {
                originalname: file.originalname,
                size: file.size,
                uploadTime: new Date(),
                extension: file.originalname.split('.').pop(),
                path: file.path,
            };

            // Save the file document to MongoDB
            // await newFile.save();

            await models.file.create(newFile);


            resolve({
                success: true,
                message: 'File uploaded and saved successfully',
                data: {
                    size: file.size,
                    uploadTime: newFile.uploadTime.toISOString(),
                    extension: file.originalname.split('.').pop(),
                    path: file.path,
                },
            });
        } catch (err) {
            console.log(err);
            reject({ code: 500, message: err.message });
        }
    });
};

const removeFile = async (filename, filePath) => {


    return new Promise(async (resolve, reject) => {
        try {
            const file = await models.file.findOne({ originalname: filename });
            if (!file) {
                throw new Error('File not found in database.');
            }

            // Remove the file document from the database
            await models.file.deleteOne({ originalname: filename });
            console.log(filePath, 'filePath');
            // Then, delete the file from the filesystem
            await fs.remove(filePath);

            // If everything went well, return a success message
            return resolve({
                success: true,
                message: 'File removed successfully',
            });
        } catch (err) {
            console.log(err);
            reject({ code: 500, message: err.message });
        }
        // First, find the file in the database by its original name (or another unique identifier)

    });
};

const addUser = (userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = await bcryptjs.genSalt()
            const hashedPassword = await bcryptjs.hash(userDetails.password, salt);
            const user = {
                ...userDetails,
                password: hashedPassword,
            }
            // logger.debug(user);
            const currentUser = await models.user.find({ username: 'pgp37324@iiml.ac.in' });
            console.log(currentUser.length);
            if (!currentUser.length) {
                console.log(currentUser, '=============>');
                await models.user.create(user);
                return resolve({ 'user': user, 'status': 'successfully added to mongo' });
            }

        } catch (err) {
            logger.error(err);
            reject({ code: 422, message: err.message });
        }
    });
}
const downloadFile = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            const filename = req.params.filename;
            const directoryPath = __dirname + '/uploads/'; // Adjust based on where your files are stored
            const filePath = directoryPath + filename;

            res.download(filePath, filename, (err) => {
                if (err) {
                    // Handle error, but don't expose to the client
                    console.log(err); // For server-side logging
                    res.status(500).send('File could not be downloaded.');
                }
            });

        } catch (err) {
            logger.error(err);
            reject({ code: 422, message: err.message });
        }
    });
}
const login = (userDetails) => {
    console.log(userDetails, 'userDetails');
    return new Promise(async (resolve, reject) => {
        try {
            logger.info(process.env.ACCESS_TOKEN_SECRET);
            const user = await models.user.findOne({ username: userDetails.username })
            if (user == null) {
                return reject({ code: 404, message: 'User not found' });
            }
            logger.info(user);
            if (await bcryptjs.compare(userDetails.password, user.password)) {
                const accessToken = generateToken(user);
                logger.debug(accessToken);
                const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET);
                return resolve({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userId: user,
                    expireIn: 604800,
                    // expireIn: 28800,
                });

            } else {
                reject({ code: 404, message: 'password does not match' });
            }
        } catch (err) {
            logger.error(err);
            return reject({ code: 422, message: err.message });
        }
    })
}
const generateToken = (user) => {
    return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: "604800s" });
}

module.exports = {
    uploadFile,
    getFiles,
    downloadFile,
    removeFile
}