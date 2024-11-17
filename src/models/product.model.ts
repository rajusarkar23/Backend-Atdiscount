import mongoose, { Model, Schema } from "mongoose";

interface productModel extends Document {
    title: string,
    specification: string[],
    price: string,
    image: {
        primary: string,
        secondary: string,
        tertiary: string
    }
}

const productSchema: Schema<productModel> = new Schema ({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    specification: {
        type: [String],
        required: [true, "Specification is required."]
    },
    price: {
        type: String,
        required: [true, "Price is required"]
    },
    image: {
        primary: {
            type: String
        },
        secondary: {
            type: String
        },
        tertiary: {
            type: String
        }
    }
}, {timestamps: true})

export const Product: Model<productModel> = mongoose.model<productModel>("Product", productSchema)