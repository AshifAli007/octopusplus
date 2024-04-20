require('dotenv').config();

const models = require('../../models');
const mongoose = require('mongoose');
const logger = require('../../config/logger');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const allUsers = require('../../assets/users/admins');



const getUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("get event functions");
            let users = await models.user.find();
            resolve(users);
        } catch (err) {
            console.log(err);
            reject({ code: 401, message: err.message });
        }

    })
}
const updateUser = (userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("update user functions");
            let user = await models.user.findOne({ _id: userDetails._id });
            console.log('user', user);
            let updatedUser = await models.user.findByIdAndUpdate(userDetails._id, userDetails);
            resolve("status: user updated successfully", updatedUser);
        } catch (err) {
            console.log(err);
            reject({ code: 401, message: err.message });
        }

    })
}
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
const addUserInBulk = async () => {
    const usersWithPassword = [];
    const databaseUsers = await models.user.find();
    for await (let user of allUsers) {
        let salt = await bcryptjs.genSalt()
        let hashedPassword = await bcryptjs.hash(user.password, salt);
        let userWithPassword = {
            ...user,
            password: hashedPassword,
        }
        const currentUser = databaseUsers.filter(i => i.username === user.username);
        if (!currentUser.length) {
            usersWithPassword.push(userWithPassword);
        }
    }
    console.log(usersWithPassword);
    await models.user.create(usersWithPassword);
}
addUserInBulk();
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
    addUser,
    login,
    getUsers,
    updateUser,
}