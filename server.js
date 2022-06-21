const express = require("express")
const dotenv = require("dotenv")
const question = require("./routers/question")
const auth = require("./routers/auth")
// Environment Variables
dotenv.config({
    path: "./config/env/config.env"
})
const app = express()
const PORT = process.env.PORT

// Routers Middleware
app.use("/api/questions",question)
app.use("/api/auth",auth)


app.listen(PORT,() => {
    console.log(`APP Started on : ${PORT}: ${process.env.NODE_ENV}` );
})