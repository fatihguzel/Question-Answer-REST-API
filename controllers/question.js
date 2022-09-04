const Question = require("../models/Question")
const CustomError = require("../helpers/error/CustomError")
const asyncErrorWrapper = require("express-async-handler")


const getAllQuestions = asyncErrorWrapper(async (req,res,next)=>{
    const questions = await Question.find()

    return res.status(200)
    .json({
        success:true,
        data:questions
    })
})
const askNewQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const information = req.body
    console.log(information)
    const question = await Question.create({
        ...information, // title : information.title
        user:req.user.id
    })

    res.status(200)
    .json({
        success:true,
        data:question 
    })
})

const getSingleQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const { id } = req.params
    const question = await Question.findById(id)
    return res.status(200)
    .json({
        success:true,
        data:question
    })
})

const editQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const { id } = req.params
    
    const {title,content} = req.body

    let question = await Question.findById(id)

    question.title = title
    question.content = content

    question = await question.save()

    return res.status(200)
    .json({
        success:true,
        data:question
    })
})

const deleteQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.params

    await Question.findByIdAndDelete(id)

    res.status(200)
    .json({
        success:true,
        message:"Question Delete Operation Successfull"
    })
})

const likeQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.params;

    const question = await Question.findById(id);

    if (question.likes.includes(req.user.id)) {
        return next (new CustomError("Your already liked this question",400));
    }

    question.likes.push(req.user.id);

    await question.save();

    res.status(200)
    .json({
        success : true,
        data : question
    });
})

const undoLikeQuestion = asyncErrorWrapper(async (req,res,next)=>{
    const {id} = req.params;

    const question = await Question.findById(id);

    if(!question.likes.includes(req.user.id)){
        return next(new CustomError("You can not undo like operation for this question",400))
    }

    const index = question.likes.indexOf(req.user.id)

    question.likes.splice(index, 1);
    
    await question.save();  

    res.status(200)
    .json({
        success : true,
        data : question
    });
})

module.exports = {
    getAllQuestions,
    askNewQuestion,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
    
}