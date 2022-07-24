const User = require('../models/User')
const sendJwtToClient = require("../helpers/authorization/sendJwtToClient")
const CustomError = require("../helpers/error/CustomError")
const register = async(req,res,next)=>{
    // POST DATA
    const { name,email,password} = req.body

    // asycn, await
    try {
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
    } catch (err) {
        return next(err)
    }
    

    // sendJwtToClient(user,res)
}
const errorTest = (req,res,next) => {
    return next(new TypeError("Type Error Message"))
}

module.exports = {
    register,
    errorTest
}