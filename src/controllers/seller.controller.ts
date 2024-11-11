import { Seller } from "../models/seller.models";
import { generateOtp } from "../utils";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

// register
const register = async (req: any, res: any) => {
    const {fullName, email, password} = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({success: false, message: "All fields are rquired"})
    }

    const findSellerByEmail = await Seller.findOne({email})

    if (findSellerByEmail) {
        return res.status(406).json({success: false, message: "Seller already available with this email."})
    }

    const otp = generateOtp()
    console.log(otp);
    
    const hashedOtp = bcryptjs.hashSync(otp, 10)
    

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const createSeller = await Seller.create({fullName, email, password: hashedPassword, otp: hashedOtp})

    if (!createSeller) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }

    const user = await Seller.findById(createSeller._id).select("-password -otp")

    const jwt_token = jwt.sign({sellerId: createSeller._id}, `${process.env.SELLER_EMAIL_JWT_SECRET}`, {expiresIn: "60m"})

    return res.cookie("otpVerifyToken", jwt_token).status(201).json({success: true, message: "User created successfully.", user, jwt_token})
}

export {register}