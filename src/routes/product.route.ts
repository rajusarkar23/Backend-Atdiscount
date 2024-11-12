import { Router } from "express";
import { addProducts } from "../controllers/product.controller";

const router = Router()

router.post("/add", addProducts)

export default router