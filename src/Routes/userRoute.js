const express = require('express')
const router = express.Router();

const userController = require('../Controllers/userController')

router.post('/register',userController.addUser)
router.post('/validateOtp',userController.validateOtp)


module.exports = router