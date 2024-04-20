const express = require('express');
const router = express.Router();
const controller = require('../controllers/userServices.controller');
const authorizeToken = require('../middlewares/authentication');

router.route('/sign-up').post(controller.addUser);
router.route('/login').post(controller.login);
router.route('/getUsers').get(authorizeToken, controller.getUsers);
router.route('/updateUser').put(authorizeToken, controller.updateUser);
router.route('/token').post();
router.route('/logout').post();

module.exports = router; 