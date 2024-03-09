const express = require('express')
const cors = require('cors')
const multer = require('multer')

//multer for the formdata
const upload = multer();

//use of app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//here we will put our routes
const otpRoute = require('./Routes/otpRoute')
//use of routes
app.use('/api/chatapp/v1/user',upload.none(),otpRoute);



module.exports = app;
