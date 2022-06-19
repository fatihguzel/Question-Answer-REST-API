const express = require("express")
const app = express()
const PORT = 5000 || process.env.PORT
app.get("/",(req,res)=>{
    res.send("<h1>Hello Question Answer API<h1>")
})
app.listen(PORT,() => {
    console.log(`APP Started on : ${PORT}`);
})