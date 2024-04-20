const logger = require('../../config/logger');
const userService = require('../services/userServices');


const getUsers = (req, res, next) => {
    userService.getUsers().then(data => {
        res.status(200).json({ "success": true, "data": data });
    })
}

const updateUser = (req, res, next) => {
    userService.updateUser(req.body.userDetails).then(data => {
        res.status(200).json({ "success": true, "data": data });
    })
}

const addUser = (req, res) => {
    logger.info(req.body.userDetails);
    let userDetails = req.body.userDetails;
    userService.addUser(userDetails).then(data => {
        res.status(200).json({ 'success': true, 'data': data });
    }).catch(err => {
        res.status(401).json({ 'error': err });
    })
}

const login = (req, res) => {
    let userDetails = req.body.userDetails;
    console.log(req, 'req');
    userService.login(userDetails).then(data => {
        res.status(200).json({ 'success': true, 'data': data });
    }).catch(err => {
        res.status(401).json({ 'error': err });
    })
}
module.exports = {
    addUser,
    login,
    getUsers,
    updateUser,
}