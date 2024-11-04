import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.listen(process.env.port,()=>{
    console.log("running at",process.env.port)
})