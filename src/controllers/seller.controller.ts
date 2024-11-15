import { Seller } from "../models/seller.model";
import { generateOtp } from "../utils";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"

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

// verify otp
const verifyOtp = async (req: any, res: any) => {
    const {otp} = req.body;
    const seller = req.sellerId
    
    const findSellerById = await Seller.findById(seller)

    if (!findSellerById) {
        return res.status(404).json({success: false, message: "Seller not found."})
    }

    const dbOtp = findSellerById.otp  
    const bcryptOtp = bcryptjs.compareSync(otp, dbOtp)
    if (!bcryptOtp) {
        return res.status(401).json({success: false, message: "Wrong otp."})
    }
    console.log(bcryptOtp);
    await findSellerById.updateOne({
        isVerified: true
    }, {new: true})
    
    const updatedSeller = await Seller.findById(findSellerById._id).select("-password -otp")
    
    const jwt_token = jwt.sign({userId: findSellerById._id}, `${process.env.SELLER_SESSION_TOKEN}`, {expiresIn: "60m"})
    
    return res.cookie("sessionToken", jwt_token).status(200).json({success: true, message: "Otp verified successfully.", updatedSeller, jwt_token})
}

// login
const login = async (req: any, res: any) => {
    const {email, password} = req.body;

    const findSellerByEmail = await Seller.findOne({email})
    console.log(findSellerByEmail);

    if (!findSellerByEmail) {
        return res.status(400).json({success: false, message:"Either email is not register or wrong password."})
    }

    if (!findSellerByEmail?.isVerified) {
        return res.status(401).json({success: false, message: "Please verify your account before login."})
    }

    const comparePassword = bcryptjs.compareSync(password, findSellerByEmail.password)
    console.log(comparePassword);
    
    if (!comparePassword) {
        return res.status(401).json({success: false, message: "Either email is not register or wrong password."})
    }

    const jwt_token = jwt.sign({userId: findSellerByEmail._id}, `${process.env.SELLER_SESSION_TOKEN}`)
    const user = await Seller.findById(findSellerByEmail._id).select("-password -otp")

    return res.cookie("sessionToken", jwt_token).status(200).json({success: true, message: "Login success", user, jwt_token})
}

// upload image
const upload = async (req: any, res: any) => {

    // setup s3client
    const s3Client = new S3Client({
        region: "auto",
        endpoint: `${process.env.CLOUDFLARE_ENDPOINT}`,
        credentials: {
            accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || ""
        },
        forcePathStyle: true
    })

    try {
        // if no file available error
        if (!req.file) {
            return res.status(400).json({success: false, message: "No file available"})
        }  
        
            // array for images that has been uploaded
            const uploadFiles = []

            // extract original file name
            const fileName = req.file.originalname
            // set up upload 
            const uploadParams = {
                Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
                Key: fileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            }
            // upload the file
            await s3Client.send( new PutObjectCommand(uploadParams))
            // set the url
            const url = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`
            // push the url to the array
            uploadFiles.push({fileName, url})
        
        return res.status(200).json({success: true, message: "Uploaded", uploadFiles})
    } catch (error) {
        console.log(error);
    }
}

export {register, verifyOtp, login, upload}