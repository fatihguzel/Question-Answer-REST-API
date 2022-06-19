const express = require("express")
const dotenv = require("dotenv")

// Environment Variables
dotenv.config({
    path: "./config/env/config.env"
})
const app = express()
const PORT = process.env.PORT
app.get("/",(req,res)=>{
    res.send("<h1>Hello Question Answer API<h1>")
})
app.listen(PORT,() => {
    console.log(`APP Started on : ${PORT}: ${process.env.NODE_ENV}` );
})