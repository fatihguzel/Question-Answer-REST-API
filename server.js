const express = require("express")
const dotenv = require("dotenv")
const routers = require("./routers")

// Environment Variables
dotenv.config({
    path: "./config/env/config.env"
})
const app = express()
const PORT = process.env.PORT

// Routers Middleware
app.use("/api",routers)


app.listen(PORT,() => {
    console.log(`APP Started on : ${PORT}: ${process.env.NODE_ENV}` );
})