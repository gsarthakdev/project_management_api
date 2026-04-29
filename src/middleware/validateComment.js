import { body } from "express-validator";
import { checkValidationResults } from "./handleValidationErrors.js";

export const validateComment = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 1000 })
    .withMessage("Comment must not exceed 1000 characters"),
  body("taskId")
    .isInt()
    .withMessage("Task ID must be a valid integer"),
  checkValidationResults,
];

export const validateCommentUpdate = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 1000 })
    .withMessage("Comment must not exceed 1000 characters"),
  checkValidationResults,
];
