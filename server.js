const express = require("express")
const dotenv = require("dotenv")
const connectDatabase = require("./helpers/database/connectDatabase")
const routers = require("./routers")
const customErrorHandler = require("./middlewares/errors/customErrorHandler")
const path = require("path")
// Environment Variables
dotenv.config({
    path: "./config/env/config.env"
})
// MongoDb Connection
connectDatabase()


const app = express()
const PORT = process.env.PORT

// Express - Body Middleware
app.use(express.json())

// Routers Middleware
app.use(express.json());
app.use("/api",routers)

// Error Handler
app.use(customErrorHandler)
app.get("/",(req,res)=>{
    res.send("<h1 style = background-color:black;color:white;>hello bro<h1>")
})

app.use(express.static(path.join(__dirname,"public")))
app.listen(PORT,() => {
    console.log(`APP Started on : ${PORT}: ${process.env.NODE_ENV}` );
})