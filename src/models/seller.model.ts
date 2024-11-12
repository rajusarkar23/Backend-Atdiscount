import mongoose, { Model, Schema } from "mongoose";

interface sellerModel extends Document {
    fullName: string,
    email: string,
    password: string,
    isVerified: boolean,
    otp: string
}

const sellerSchema: Schema<sellerModel> = new Schema ({
    fullName: {
        type: String,
        required: [true, "Full name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        required: [true, "OTP is required"]
    }
}, {timestamps: true})

export const Seller: Model<sellerModel> = mongoose.model<sellerModel>("Seller", sellerSchema)