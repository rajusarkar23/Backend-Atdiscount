import { User } from "../models/user.model";
import bcryptjs from "bcryptjs"
import { generateOtp } from "../utils";
import jwt from "jsonwebtoken"

// Register
const register = async (req: any, res: any) => {
    const {fullName, email, password} = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({success: false, message: "All fields are rquired"})
    }

    const findUserByEmail = await User.findOne({email})

    if (findUserByEmail) {
        return res.status(406).json({success: false, message: "User already available with this email."})
    }

    const otp = generateOtp()
    const hashedOtp = bcryptjs.hashSync(otp, 10)
    

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const createUser = await User.create({fullName, email, password: hashedPassword, otp: hashedOtp})

    if (!createUser) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }

    const createdUser = await User.findById(createUser._id).select("-password -otp")

    const jwt_token = jwt.sign({userId: createUser._id}, `${process.env.EMAIL_JWT_SECRET}`, {expiresIn: "60m"})

    return res.cookie("otpVerifyToken", jwt_token).status(201).json({success: true, message: "User created successfully.", createdUser, jwt_token})
}

// Login
const login = (req:any, res:any) => {
    return res.status(200).json({message: "login"})
}
export {register, login}