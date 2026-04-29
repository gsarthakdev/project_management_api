import { body } from "express-validator";
import { checkValidationResults } from "./handleValidationErrors.js";

export const validateProject = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ max: 100 })
    .withMessage("Project name must not exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  checkValidationResults,
];
