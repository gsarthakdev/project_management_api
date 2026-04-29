import express from "express";
import * as authController from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../middleware/validateAuth.js";

const router = express.Router();

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateLogin, authController.login);

export default router;
