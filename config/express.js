const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../index.route');
const config = require('./serverConfig');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use('/v1',routes);

module.exports = app;