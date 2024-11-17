import { Product } from "../models/product.model";
import { ObjectId } from "mongodb";

const addProducts = async (req: any, res: any) => {
    
    const {title, specification, price, image} = req.body;

    const addProduct = await Product.create({
        title: title,
        specification: specification,
        price: price,
        image: image
    })
    console.log(addProduct);
    return res.status(200).json({message: "Product created."})
}

// get latest 4 products
const getProducts  = async (req: any, res: any) => {
    const products = await Product.find().sort({createdAt: -1}).limit(4)
    console.log(products.length);
    return res.status(200).json({products})
}
// get all products
const getAllProducts = async (req:any, res: any) => {
    const allproducts = await Product.find().sort({createdAt: -1})
    console.log(allproducts.length);
    return res.status(200).json({allproducts})
}

// get product by id
const getProductById = async (req:any, res:any) => {
    const {id} = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }
    const productById = await Product.findById(id)
    if (!productById) {
        return res.status(401).json({success: false, message: "No product found"})
    }
    console.log(productById);
    return res.status(200).json({productById})
}

// find by id and delete product

const deleteById = async (req: any, res: any) => {
    const {id} = req.params

    if (!ObjectId.isValid(id)) {
        return res.status(401).json({error: "Id do not exist or invalid is"})
    }

    const deleteProduct = await Product.findByIdAndDelete(id)
    console.log("deleted");
    
    console.log(deleteProduct);
    
    return res.status(200).json({success: true, message: "Delete success.", deleteProduct})
}

export {addProducts, getProducts, getAllProducts, getProductById, deleteById}