const mongoose = require("mongoose");
const userModel = require("../Models/userModel");

exports.addUser = async (req, res, next) => {
  //if user allready exist (using number)
  const user = await userModel.findOne({
    phoneNumber: req.body.phonenumber,
  });
  if (user && user.userStatus == "Not-Verified") {
    //update user
    const updateUser = await userModel.updateOne(
      { phoneNumber: req.body.phonenumber },
      {
        $set: {
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          email: req.body.email,
          phoneNumber: req.body.phonenumber,
        },
      }
    );
    if (!updateUser) {
      return res.status(400).json({ message: "Server Error" });
    }
  } else if (!user) {
    //create new user
    const newUser = new userModel({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      phoneNumber: req.body.phonenumber,
    });
    await newUser.save().catch((err) => {
      return res.status(400).json({ message: "Failed to Register" });
    });
  } else if (user && user.userStatus == "Verified") {
    return res.status(201).json({ message: "User already exists" });
  }
  return res.status(200).json({ message: await sendOtp(req.body.phonenumber) });
};

//to validate otp in register
exports.validateOtp = async (req, res, next) => {
  const isValidate = await verifyOtp(req.body.phonenumber, req.body.otp);
  if (isValidate == "Otp Verified") {
    const updateUser = await userModel.updateOne(
      { phoneNumber: req.body.phonenumber },
      {
        $set: {
          userStatus: "Verified",
        },
      }
    );
    if (!updateUser) {
      return res.json({ message: "Server Error" });
    }
    return res.json({ message: isValidate });
  } else return res.json({ message: isValidate });
};

//login API
exports.login = async (req, res, next) => {
  res.json({ message: await sendOtp(req.res.phonenumber) });
};
//matchOtp
exports.matchOtp = async (req, res, next) => {
  res.json({ message: await verifyOtp(req.body.phonenumber, req.body.otp) });
};

//testing
exports.getAllUser = async (req, res) => {
  res.json({ data: await userModel.find() });
};

///////////////////////////FUNCTIONS////////////////////

//to Send otp with validations
const sendOtp = async (number) => {
  var unirest = require("unirest");
  //cheching user presence in db(user)
  const user = await userModel.findOne({
    phoneNumber: number,
  });
  if (!user) return "Account not found!";

  //Sending otp
  var randomOtp = Math.floor(999 + Math.random() * 9000);
  var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
  req.headers({
    authorization:
      "ZVJjuAGqPwW9Nl6X8ovdyH0mDzirCc1U3QsbETfn7LRxKBtMgSdtSxV9QvA8yqukg6s4XWC3azIOeTGE",
  });
  req.form({
    variables_values: randomOtp,
    route: "otp",
    numbers: number,
  });
  req.end(function (res) {
    if (res.error) return res.error;
  });

  //Updating db with Otp
  var updateUser = await userModel.updateOne(
    { phoneNumber: number },
    {
      $set: {
        otp: randomOtp,
      },
    }
  );
  if (updateUser) return `Otp has been sent to ${number}`;
  return "Error while sending OTP!";
};

//to verify otp
const verifyOtp = async (number, enteredOtp) => {
  const isExist = await userModel.findOne({
    phoneNumber: number,
    otp: enteredOtp,
  });
  if (isExist) return "Otp Verified";
  else return "Invalid OTP";
};
