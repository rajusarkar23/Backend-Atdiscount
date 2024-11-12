import mongoose, { Model, Schema } from "mongoose";

interface productModel extends Document {
    title: string,
    specification: string[],
    price: string,
    image: string[]
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
        type: [String],
        required: [true, "Image is required"]
    }
}, {timestamps: true})

export const Product: Model<productModel> = mongoose.model<productModel>("Product", productSchema)