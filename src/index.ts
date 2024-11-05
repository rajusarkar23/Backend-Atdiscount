import express from "express"
import { dbConnect } from "./db"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
    credentials: true
}))


dbConnect()
    .then(() => {
        app.listen(`${process.env.SERVER_PORT}`)
        console.log(`Server is up and running on port ${process.env.SERVER_PORT}`);
    })
    .catch((error) => {
        console.log(error);
    })

import userRouter from "./routes/user.route"
app.use("/api/v1/user", userRouter)
