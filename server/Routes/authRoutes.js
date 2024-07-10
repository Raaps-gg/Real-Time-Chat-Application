const express = require('express');
const router = express.Router();
const { loginUser, logoutUser, signupUser, getAllUsers } = require('../Controllers/authControllers')

router.post('/login', loginUser)

router.get('/logout', logoutUser)

router.post('/signup', signupUser)

router.get('/getall', getAllUsers)

module.exports = router