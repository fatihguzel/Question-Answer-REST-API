const express = require('express')
const {register} = require('../controllers/auth')
// api/auth
// api/auth/register
const router = express.Router()

router.post("/register",register)


module.exports = router