import { Router } from "express";
import { register, verifyOtp } from "../controllers/seller.controller";
import { sellerOtpAuthMiddleware } from "../middlewares/seller.middleware";

const router = Router()

router.post("/register", register)
router.post("/verify-otp", sellerOtpAuthMiddleware, verifyOtp)

export default router