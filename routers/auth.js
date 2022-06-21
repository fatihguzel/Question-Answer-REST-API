const express = require('express')
// api/auth
// api/auth/register
const router = express.Router()

router.get("/",(req,res)=>{
    res.send("Auth Home Page")
})

router.get("/register",(req,res)=>{
    res.send("Auth Register Page")
})

module.exports = router