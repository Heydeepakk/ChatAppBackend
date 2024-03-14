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
    return res.status(201).json({ message: "Number already exists" });
  }
  const response = await sendOtp(req.body.phonenumber);
  return res.status(response.status).json({ message: response.message });
};

//to validate otp in register
exports.validateOtp = async (req, res, next) => {
  const isValidate = await verifyOtp(req.body.phonenumber, req.body.otp);
  if (isValidate.status == 200) {
    const updateUser = await userModel.updateOne(
      { phoneNumber: req.body.phonenumber },
      {
        $set: {
          userStatus: "Verified",
        },
      }
    );
    if (!updateUser) {
      return res.status(403).json({ message: "Server Error" });
    }
    return res.status(201).json({ message: "Successfully Registered!" });
  } else return res.status(400).json({ message: isValidate.message });
};

//login API
exports.login = async (req, res, next) => {
  const response = await sendOtp(req.body.phonenumber);
  res.status(response.status).json({ message: response.message });
};
//matchOtp
exports.matchOtp = async (req, res, next) => {
  const response = await verifyOtp(req.body.phonenumber, req.body.otp);
  res.status(response.status).json({ message: response.message });
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
    userStatus: "Verified",
  });
  if (!user) return { status: 404, message: "Account not found!" };

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
  if (updateUser)
    return { status: 200, message: `Otp has been sent to ${number}` };
  return {
    status: 400,
    message: "Something went wrong, Please try after some time",
  };
};

//to verify otp
const verifyOtp = async (number, enteredOtp) => {
  const isExist = await userModel.findOne({
    phoneNumber: number,
    otp: enteredOtp,
  });
  if (isExist) return { status: 200, message: "Otp Verified" };
  else return { status: 400, message: "Invalid OTP" };
};
