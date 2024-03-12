const mongoose = require('mongoose')
const Schema =  mongoose.Schema;

const userSchema = new Schema({
    Name:{
        type:String
    },
    Age:{
        type:Number
    },
    // email:{
    //     type:String
    // },
    // phoneNumber:{
    //     type:String
    // },
    // otp:{
    //     type:String
    // }

},{timestamps:true});

const user = mongoose.model('Data2',userSchema)

module.exports = user;