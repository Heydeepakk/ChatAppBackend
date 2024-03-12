const mongoose = require('mongoose')
const userModel = require('../Models/userModel')


exports.addUser = async (req,res,next)=>{
    const randomOtp = Math.floor(999 + Math.random()*9000);
    const newUser = new userModel({
        firstName:  req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        phoneNumber: req.body.phonenumber,
        otp: randomOtp
    })
    await newUser.save();
    res.status(200).json({
        message:'User added successfully',
    });
}

exports.getAllUser = (req,res,next)=>{
    userModel.find({})
  .exec()
  .then((users) => {
    res.status(200).json({users}) 
  })
  .catch((err) => {
    res.status(400).json({error:err})
  })
}