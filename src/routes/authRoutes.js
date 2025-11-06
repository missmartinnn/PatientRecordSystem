import express from "express"
import { register, login, getMe, logout } from "../controllers/authController.js"
import { protect } from "../middleware/auth.js"
import { doctorRegisterValidation, doctorLoginValidation, validate } from "../middleware/validator.js"

const router = express.Router()

router.post("/register", doctorRegisterValidation, validate, register)
router.post("/login", doctorLoginValidation, validate, login)
router.get("/me", protect, getMe)
router.post("/logout", protect, logout)

export default router
