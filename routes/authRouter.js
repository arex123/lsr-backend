import express from 'express'
import googleLogin from '../controllers/authController.js'
const router = express.Router()

router.get('/test',(req,res)=>{
    console.log("testing")
    res.send("server test passed")
})

router.get('/google',googleLogin)
export default router