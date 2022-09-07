const express = require('express')
const {getAccessToRoute} = require("../middlewares/authorization/auth")
const {addNewAnswerToQuestion,getAllAnswerByQuestion} = require("../controllers/answer")

const router = express.Router({mergeParams:true})

router.post("/",getAccessToRoute,addNewAnswerToQuestion)
router.get("/",getAllAnswerByQuestion)

module.exports = router