const express = require('express');
const registerUser = require('../controller/registerUser');
const loginUser = require('../controller/loginUser');


const router = express.Router();

//register user api
router.post('/register', registerUser)
//register user api
router.post('/login', loginUser)






module.exports = router;