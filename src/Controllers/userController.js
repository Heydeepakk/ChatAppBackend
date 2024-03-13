const mongoose = require("mongoose");
const userModel = require("../Models/userModel");

exports.addUser = async (req, res, next) => {
  //if user allready exist (using number)
  const user = await userModel.findOne({
    phoneNumber: req.body.phonenumber,
  });
  if (user) {
    //upadte user
    const updateUser = await userModel.updateOne(
      { phoneNumber: req.body.phonenumber },
      {
        $set: {
          firstName: req.body.firstname,
          lastName: req.body.lastname,
          email: req.body.email,
          phoneNumber: req.body.phonenumber,
          otp: randomOtp,
        },
      }
    );
    if (updateUser) {
      res.json({ message: "update" });
    } else {
      res.json({ message: "Server Error" });
    }
    res.status(409).json({ message: "User already Exists!" });
  } else {
    //create new user
    const newUser = new userModel({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      phoneNumber: req.body.phonenumber,
    });
    newUser
      .save()
      .then(
        res.status(200).json({
          message: "Registered successfully",
        })
      )
      .catch((err) => {
        res.status(400).json({ message: "Failed to Register" });
      });
  }
};

exports.getAllUser = (req, res, next) => {
  userModel
    .find({})
    .exec()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
};

const sendOtp = async (number) => {
  var unirest = require("unirest");
  //cheching user presence in db(user)
  const user = await userModel.findOne({
    phoneNumber: number,
  });
  if (!user) return "Number not registered";

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
