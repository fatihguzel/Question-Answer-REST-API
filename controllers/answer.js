const Question = require("../models/Question"); 
const Answer = require("../models/Answer");
const User = require("../models/User")
const CustomError = require("../helpers/error/CustomError")
const asyncErrorWrapper = require("express-async-handler")


const addNewAnswerToQuestion = asyncErrorWrapper(async (req,res,next)=>{

    const {question_id} = req.params

    const user_id = req.user.id

    const information = req.body

    const answer = await Answer.create({
        ...information,
        question : question_id,
        user: user_id
    })
    return res.status(200).
    json({
        success:true,
        data:answer
    })
})

const getAllAnswerByQuestion = asyncErrorWrapper(async (req,res,next)=>{

    const {question_id} = req.params

    const question = await Question.findById(question_id).populate("answers")

    const answers = question.answers

    return res.status(200)
    .json({
        success:true,
        count:answers.length,
        data:answers
    })
})

const getSingleAnswer = asyncErrorWrapper(async (req,res,next)=>{
    const {answer_id} = req.params

    const answer = await Answer
    .findById(answer_id)
    // .populate({             There is not working
    //     path:"question",
    //     select:"title"
    // })
    // .populate({
    //     path:"user",
    //     select:"name profile_image"
    // })
    // log(answer.populated())

    return res.status(200)
    .json({
        success:true,
        data: answer
    })
})

const editAnswer = asyncErrorWrapper(async (req,res,next)=>{
    const {answer_id} = req.params

    const {content} = req.body

    let answer = await Answer.findById(answer_id)

    answer.content = content

    await answer.save()

    return res.status(200)
    .json({
        success: true,
        data: answer
    })
})

const deleteAnswer = asyncErrorWrapper(async (req,res,next)=>{
    const {answer_id} = req.params
    const {question_id} = req.params

    await Answer.findByIdAndRemove(answer_id)

    const question = await Question.findById(question_id)

    question.answers.splice(question.answers.indexOf(answer_id), 1)

    await question.save()

    return res.status(200)
    .json({
        success:true,
        message:"Answer deleted successfully"
    })
})

const likeAnswer = asyncErrorWrapper(async (req,res,next)=>{
    const {answer_id} = req.params;

    const answer = await Answer.findById(answer_id);

    if (answer.likes.includes(req.user.id)) {
        return next (new CustomError("Your already liked this question",400));
    }

    answer.likes.push(req.user.id);

    await answer.save();

    res.status(200)
    .json({
        success : true,
        data : answer
    });
})

const undoLikeAnswer = asyncErrorWrapper(async (req,res,next)=>{
    const {answer_id} = req.params;

    const answer = await Answer.findById(answer_id);

    if(!answer.likes.includes(req.user.id)){
        return next(new CustomError("You can not undo like operation for this question",400))
    }

    const index = answer.likes.indexOf(req.user.id)

    answer.likes.splice(index, 1);
    
    await answer.save();  

    res.status(200)
    .json({
        success : true,
        data : answer
    });
})

module.exports = { 
    addNewAnswerToQuestion,
    getAllAnswerByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    undoLikeAnswer
}