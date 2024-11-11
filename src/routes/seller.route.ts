import { Router } from "express";
import { register } from "../controllers/seller.controller";

const router = Router()

router.post("/register", register)

export default router