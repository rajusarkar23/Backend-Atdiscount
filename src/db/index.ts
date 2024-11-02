import mongoose from "mongoose"
import { DB_Name } from "../utils"

const dbConnect = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_DB_CONNECT_STRING}/${DB_Name}`)
        console.log("Db connected");
    } catch (error) {
        console.log(error);
    }
   
}

export {dbConnect}