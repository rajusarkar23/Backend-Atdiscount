import mongoose, { Model, Schema } from "mongoose";

interface userModel extends Document {
    fullName: string,
    email: string,
    password: string,
    isVerified: boolean,
    otp: string
}

const userSchema: Schema<userModel>  = new Schema ({
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
        required: [true, "Otp is required"]
    }
})

export const User: Model<userModel> = mongoose.model<userModel>("User", userSchema)