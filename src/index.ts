import expres from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnection } from "./db/db";

dotenv.config();
// express app
const app = expres();
// allow json data and cookies
app.use(expres.json());
app.use(cookieParser());

// cors settings

// app port
const PORT = process.env.SERVER_PORT;

// connect db and start the app
dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Sever is up and running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// routes config
