var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    username: {type:String,required:[true,'name is required!!'],index:{unique:true},sparse:true},
    password:  {type:String,required: true},
    privileges: {type:String,required:true},
    events: {type:Array,required:true},
    name: {type:String,required:true},
    college: {type:String,required:true},
    course: {type:String,required:true},
    phone: {type:String,required:true},
});

module.exports = mongoose.model('user', user);