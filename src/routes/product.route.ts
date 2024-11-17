import { Router } from "express";
import { addProducts, deleteById, getAllProducts, getProductById, getProducts } from "../controllers/product.controller";

const router = Router()

router.post("/add", addProducts)
router.get("/get-products", getProducts)
router.get("/get-all-products", getAllProducts)
router.get("/get-product-by-id/:id", getProductById)
router.delete("/delete-product/:id", deleteById)

export default router