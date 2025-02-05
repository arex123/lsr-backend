import axios from 'axios'
import {oauth2client} from '../config/google.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const googleLogin = async(req,res)=>{
    try{
        const {code} = req.query
        const googleRes = await oauth2client.getToken(code)
        oauth2client.setCredentials(googleRes.tokens)

        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)
        const {email,name,picture,googleId} = userRes.data
        let user = await User.findOne({email})
        if(!user){
            user=await User.create({
                name,email,picture
            })
        }

        const {_id} = user
        const token = jwt.sign({_id,email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_TIMEOUT})

        res.status(200).json({
            message:'Success',
            token,
            user
        })

    }catch(error){
        console.log("err ",error)
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
export default googleLogin 