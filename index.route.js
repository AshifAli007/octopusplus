const express = require('express');
const router = express.Router();

const userServiceRoutes = require('./server/routes/userServices.router');
const fileServiceRoutes = require('./server/routes/fileServices.router');


router.get('/health-check', (req, res) => res.send('Server is up'));
router.use('/userService', userServiceRoutes);
router.use('/fileService', fileServiceRoutes);

module.exports = router;