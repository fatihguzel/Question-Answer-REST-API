const express = require('express')
const answer = require("./answer")
const {
    getSingleQuestion,
    getAllQuestions,
    askNewQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
} = require('../controllers/question')
const {
    checkQuestionExist
} = require("../middlewares/database/databaseErrorHelpers")
const {getAccessToRoute,getQuestionOwnerAccess} = require("../middlewares/authorization/auth")

// api/questions
const router = express.Router()
router.get("/",getAllQuestions)
router.get("/:id",checkQuestionExist,getSingleQuestion)
router.get("/:id/like",[getAccessToRoute,checkQuestionExist],likeQuestion);
router.get("/:id/undo_like",[getAccessToRoute,checkQuestionExist],undoLikeQuestion);
router.post("/ask",getAccessToRoute,askNewQuestion)
router.put(
    "/:id/edit",
    [getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],
    editQuestion
)
router.delete(
    "/:id/delete",
    [getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],
    deleteQuestion
)

router.use("/:question_id/answers",checkQuestionExist,answer)

module.exports = router