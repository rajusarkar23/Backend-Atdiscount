import { Router } from "express";
import { login, register, verifyOtp } from "../controllers/user.controller";
import { otpAuthMiddleware } from "../middlewares/user.middleware";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/verify-otp", otpAuthMiddleware, verifyOtp)

export default router