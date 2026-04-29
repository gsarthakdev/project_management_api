import { body } from "express-validator";
import { checkValidationResults } from "./handleValidationErrors.js";

export const validateSignup = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").trim().notEmpty().withMessage("Name is required"),
  checkValidationResults,
];

export const validateLogin = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  checkValidationResults,
];
