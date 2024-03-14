const express = require("express");
const cors = require("cors");
const multer = require("multer");

//multer for the formdata
const upload = multer();

//use of app
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//here we will put our routes
const userRoute = require("./Routes/userRoute");
//use of routes
app.use("/api/chatapp/v1/user", upload.none(), userRoute);

module.exports = app;
