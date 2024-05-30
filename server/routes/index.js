const express = require('express');
const registerUser = require('../controller/registerUser');
const userDetails = require('../controller/userDetails');
const loginUser = require('../controller/loginUser');


const router = express.Router();

//register user api
router.post('/register', registerUser)
//register user api
router.post('/login', loginUser)
//login user details
router.get('/user-details', userDetails)





module.exports = router;