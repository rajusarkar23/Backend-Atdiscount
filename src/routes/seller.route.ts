import { Router } from "express";
import { login, register, verifyOtp } from "../controllers/seller.controller";
import { sellerOtpAuthMiddleware } from "../middlewares/seller.middleware";

const router = Router()

router.post("/register", register)
router.post("/verify-otp", sellerOtpAuthMiddleware, verifyOtp)
router.post("/login", login)

export default router