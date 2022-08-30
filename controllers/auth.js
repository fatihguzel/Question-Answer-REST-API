const User = require('../models/User')
const {sendJwtToClient} = require("../helpers/authorization/tokenhelpers")
const CustomError = require("../helpers/error/CustomError")
const asyncErrorWrapper = require("express-async-handler")
const {validateUserInput,comparePassword} = require("../helpers/input/inputHelpers")

const sendEmail = require("../helpers/libraries/sendEmail")
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

// Forgot Password
const forgotPassword = asyncErrorWrapper(async(req,res,next)=>{
    const resetEmail = req.body.email
    const user = await User.findOne({email:resetEmail})
    if(!user){
        return next(new CustomError("There is no user with that email",400))
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser()
    await user.save()

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`

    const emailTemplate = `
    <h3>Reset Your Password </h3>
    <p>This <a href = '${resetPasswordUrl}' target = '_blank'>link </a> will expire in hour</p>
    `
    try{
        await sendEmail({
            from: process.env.SMTP_USER,
            to : resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        })
        return res.status(200).json({
            success:true,
            message:"Token Sent Your Email"
        })
    }
   catch(err){
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        return next(new CustomError("Email Could Not Be Sent",500))
   }
})

const resetPassword = asyncErrorWrapper(async(req,res,next)=>{

    const {resetPasswordToken} = req.query
    const {password} = req.body

    if(!resetPasswordToken){
        return next(new CustomError("Please provide a valid token",400))
    }
    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    })

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    
    await user.save()

    
    return res.status(200)
    .json({
        success:true,
        message:"Reset Password Process Successful"
    })
})
module.exports = {
    register,
    login,
    logout,
    imageUpload,
    getUser,
    forgotPassword,
    resetPassword
}