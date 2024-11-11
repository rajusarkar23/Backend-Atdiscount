import { NextFunction } from "express";
import jwt from "jsonwebtoken"

export function sellerOtpAuthMiddleware (req: any, res: any, next: NextFunction) {
    const authHeader = req.headers["authorization"] ?? ""

    try {
        const decode = jwt.verify(authHeader, `${process.env.SELLER_EMAIL_JWT_SECRET}`)
        //@ts-ignore
        if (decode.sellerId) {
            //@ts-ignore
            req.sellerId = decode.sellerId
            return next()
        }
    } catch (error) {
        console.log(error);
        return
    }
}