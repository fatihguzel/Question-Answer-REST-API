const express = require("express")
const dotenv = require("dotenv")
const connectDatabase = require("./helpers/database/connectDatabase")
const routers = require("./routers")

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

app.listen(PORT,() => {
    console.log(`APP Started on : ${PORT}: ${process.env.NODE_ENV}` );
})