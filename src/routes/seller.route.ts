import { Router } from "express";
import { login, register, upload, verifyOtp } from "../controllers/seller.controller";
import { sellerOtpAuthMiddleware } from "../middlewares/seller.middleware";
import { multerUpload } from "../utils";

const router = Router()

router.post("/register", register)
router.post("/verify-otp", sellerOtpAuthMiddleware, verifyOtp)
router.post("/login", login)
router.post("/upload", multerUpload.single("image"), upload)

export default router