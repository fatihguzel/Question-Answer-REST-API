const User = require('../models/User')
const sendJwtToClient = require("../helpers/authorization/sendJwtToClient")
const CustomError = require("../helpers/error/CustomError")
const asyncErrorWrapper = require("express-async-handler")
const register = asyncErrorWrapper(async(req,res,next)=>{
    // POST DATA
    const { name,email,password} = req.body
    
    // asycn, await
        const user = await User.create({
            name,
            email,
            password
        })
        res.status(200)
        .json({
            success:true,
            data: user
        })
        // console.log(req.body);
    sendJwtToClient(user,res)
})
const errorTest = (req,res,next) => {
    return next(new TypeError("Type Error Message"))
}

module.exports = {
    register,
    errorTest
}