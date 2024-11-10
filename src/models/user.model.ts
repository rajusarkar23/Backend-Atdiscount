import mongoose, { Model, Schema } from "mongoose";

interface userModel extends Document {
    fullName: string,
    email: string,
    address: string,
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
    address: {
        streetOrLocality: {
            type: String,
        },
        city: {
            type: String,
        },
        pincode: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        mobileNumber: {
            type: String,
        }
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
}, {timestamps: true})

export const User: Model<userModel> = mongoose.model<userModel>("User", userSchema)