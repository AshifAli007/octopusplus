var mongoose = require('mongoose');
var config = require('./serverConfig');
var mongoDB = config.mongoUri;

console.log(mongoDB);
mongoose.connect(mongoDB, { useNewUrlParser:true, useUnifiedTopology:true });

var db = mongoose.connection;

db.once('open',()=>{
    console.log('connection to the database established successfully');
});

module.exports = db;