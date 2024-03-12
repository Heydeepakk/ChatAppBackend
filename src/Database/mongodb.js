const mongoose = require('mongoose');
const uri = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@chat-app.qckmeog.mongodb.net/?retryWrites=true&w=majority&appName=chat-app";

run = () =>{
  mongoose.connect(uri)
  .then(
    console.log("Connected to MongoDB")
  )
  .catch(err =>{
    console.log('Failed to connect to connect ')
  }
  )
}

module.exports = run;