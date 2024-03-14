const express = require('express')
const router = express.Router();

const userController = require('../Controllers/userController')

router.post('/genertateOtp',userController.addUser)
router.post('/register',userController.validateOtp)


router.get('/getAllUser',userController.getAllUser)



module.exports = router