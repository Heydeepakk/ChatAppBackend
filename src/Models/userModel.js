const mongoose = require('mongoose')
const Schema =  mongoose.Schema;

const userSchema = new Schema({
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
        type:String
    }

},{timestamps:true});

const user = mongoose.model('User',userSchema)

module.exports = user;