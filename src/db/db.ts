import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants";

const dbConnection = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_DB_CONNECT_STRING}/${DB_NAME}`)
        console.log(`DB Connected!!, and the db instance is: ${connect.connection.host}`);
        
    } catch (error) {
        console.log(error);
    }
}

export {dbConnection}