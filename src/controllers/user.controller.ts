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
    console.log(otp);
    
    const hashedOtp = bcryptjs.hashSync(otp, 10)
    

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const createUser = await User.create({fullName, email, password: hashedPassword, otp: hashedOtp})

    if (!createUser) {
        return res.status(500).json({success: false, message: "Internal server error"})
    }

    const user = await User.findById(createUser._id).select("-password -otp")

    const jwt_token = jwt.sign({userId: createUser._id}, `${process.env.EMAIL_JWT_SECRET}`, {expiresIn: "60m"})

    return res.cookie("otpVerifyToken", jwt_token).status(201).json({success: true, message: "User created successfully.", user, jwt_token})
}

// Verify otp
const verifyOtp = async (req: any, res: any) => {
    const {otp} = req.body;
    const user = req.userId
    
    const findUserById = await User.findById(user)

    if (!findUserById) {
        return res.status(404).json({success: false, message: "User not found."})
    }

    const dbOtp = findUserById.otp  
    const bcryptOtp = bcryptjs.compareSync(otp, dbOtp)
    if (!bcryptOtp) {
        return res.status(401).json({success: false, message: "Wrong otp."})
    }
    console.log(bcryptOtp);
    await findUserById.updateOne({
        isVerified: true
    }, {new: true})
    
    const updatedUser = await User.findById(findUserById._id).select("-password -otp")
    
    const jwt_token = jwt.sign({userId: findUserById._id}, `${process.env.SESSION_TOKEN}`, {expiresIn: "60m"})
    
    return res.cookie("sessionToken", jwt_token).status(200).json({success: true, message: "Otp verified successfully.", updatedUser, jwt_token})
}

// Login
const login = async (req:any, res:any) => {
    const {email, password} = req.body;

    const findUserByEmail = await User.findOne({email})
    console.log(findUserByEmail);

    if (!findUserByEmail) {
        return res.status(400).json({success: false, message:"Either email is not register or wrong password."})
    }

    if (!findUserByEmail?.isVerified) {
        return res.status(401).json({success: false, message: "Please verify your account before login."})
    }

    const comparePassword = bcryptjs.compareSync(password, findUserByEmail.password)
    console.log(comparePassword);
    
    if (!comparePassword) {
        return res.status(401).json({success: false, message: "Either email is not register or wrong password."})
    }

    const jwt_token = jwt.sign({userId: findUserByEmail._id}, `${process.env.SESSION_TOKEN}`)
    const user = await User.findById(findUserByEmail._id).select("-password -otp")

    return res.cookie("sessionToken", jwt_token).status(200).json({success: true, message: "Login success", user, jwt_token})
    
}
export {register, login, verifyOtp}