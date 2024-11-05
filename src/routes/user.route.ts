import { Router } from "express";
import { findUserByJwt, login, register, verifyOtp, verifyValidOtpJwt } from "../controllers/user.controller";
import { findUserByJwtMiddleware, otpAuthMiddleware } from "../middlewares/user.middleware";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/verify-otp", otpAuthMiddleware, verifyOtp)
router.post("/verify-valid-otp-jwt", otpAuthMiddleware, verifyValidOtpJwt)
router.post("/find-user-by-jwt",findUserByJwtMiddleware,findUserByJwt)

export default router