const express = require('express')

const router = express.Router();

router.post('/otp',(req,res)=>{
    res.status(200).json(req.body);
})

module.exports = router