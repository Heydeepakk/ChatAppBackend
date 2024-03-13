const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userStatus: {
      type: String,
      default: "Activate",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    otp: {
      type: Number,
    },
  },
  { collection: "User", timestamps: true }
);

const user = mongoose.model("User", userSchema);

module.exports = user;
