const mongoose = require('mongoose')
const Schema =  mongoose.Schema;

const User = new Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    otp:{
        type:string
    }

},{timestamps:true});

module.exports = user;