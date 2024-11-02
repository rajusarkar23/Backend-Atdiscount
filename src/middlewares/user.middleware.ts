import { NextFunction } from "express";
import jwt from "jsonwebtoken"

export function otpAuthMiddleware (req: any, res: any, next: NextFunction) {
    // first get the authheader
    // decode the auth header
    // check if userId available
    const authHeader = req.headers["authorization"] ?? ""

    try {
        const decode = jwt.verify(authHeader, `${process.env.EMAIL_JWT_SECRET}`)
        //@ts-ignore
        if (decode.userId) {
            //@ts-ignore
            req.userId = decode.userId
            return next()
        } else{
            return res.status(401).json({success: false, message: "You are not allowed"})
        }
    } catch (error) {
        console.log(error);
        return
    }
}