import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.mongodb_url)
const MongodbConnect =async ()=>{
    try{
        await mongoose.connect(process.env.mongodb_url)
        console.log("database connected")

    }catch(err){
        console.error("Error while connecting database ",err)
        process.exit(1)
    }

}
export default MongodbConnect