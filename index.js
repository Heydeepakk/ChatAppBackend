const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const app = require('./src/app.js')

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log('Server is runningh on the port : '+port);
})


