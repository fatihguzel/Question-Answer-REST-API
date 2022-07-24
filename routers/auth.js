const express = require('express')
const {register,errorTest} = require('../controllers/auth')
// api/auth
// api/auth/register
const router = express.Router()

router.post("/register",register)
router.get("/error",errorTest)

module.exports = router