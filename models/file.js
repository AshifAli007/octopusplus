var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const file = new Schema({

    originalname: {type:String,required: true},
    size: {type:Number,required: true},
    uploadTime: {type:Date,required: true},
    extension: {type:String,required: true},
    path: {type:String,required: true},
});

module.exports = mongoose.model('file', file);