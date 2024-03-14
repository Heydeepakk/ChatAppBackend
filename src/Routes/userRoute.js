const express = require('express')
const router = express.Router();

const userController = require('../Controllers/userController')
//Api for register
router.post('/genertateOtp',userController.addUser)
router.post('/register',userController.validateOtp)
//Api for login
router.post('/login',userController.login)
router.post('/validateOtp',userController.matchOtp)

//testing
router.get('/getAllUser',userController.getAllUser)



module.exports = router