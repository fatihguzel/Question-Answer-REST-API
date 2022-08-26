const User = require('../models/User')
const {sendJwtToClient} = require("../helpers/authorization/tokenhelpers")
const CustomError = require("../helpers/error/CustomError")
const asyncErrorWrapper = require("express-async-handler")
const {validateUserInput,comparePassword} = require("../helpers/input/inputHelpers")


const register = asyncErrorWrapper(async(req,res,next)=>{
    // POST DATA
    const { name,email,password} = req.body
    
    // asycn, await
        const user = await User.create({
            name,
            email,
            password
        })
        // console.log(req.body);
    sendJwtToClient(user,res)
})
const login = asyncErrorWrapper(async(req,res,next)=>{
    const {email,password} = req.body
    
    if(!validateUserInput(email,password)){
        return next(new CustomError("Please check your inputs",400))
    }

    const user = await User.findOne({email}).select("+password")
    
    if(!comparePassword(password,user.password)){
        return next(new CustomError("Please check your credentials",400))
    }
    sendJwtToClient(user,res)
})
const getUser = (req,res,next)=>{
    res.json({
        success:true,
        data:{
            id : req.user.id,
            name: req.user.name
        }
    })
}
const logout = asyncErrorWrapper(async(req,res,next)=>{
    
    const {NODE_ENV} = process.env
    return res.status(200)
    .cookie({
        httpOnly : true,
        expires: new Date(Date.now()),
        secure : NODE_ENV == "development" ? false : true
    })
    .json({
        success:true,
        message: "Logout Successfully"
    })
})
const imageUpload = asyncErrorWrapper(async(req,res,next)=>{
    // Image Upload Success
    const user = await User.findByIdAndUpdate(req.user.id,{
        "profile_image" : req.savedProfileImage
    },{
        new : true,
        runValidators : true
    })
    res.status(200)
    .json({
        success:true,
        message:"Image Upload Successfull",
        data : user
    })
})
module.exports = {
    register,
    login,
    logout,
    imageUpload,
    getUser
}