import { body } from "express-validator";
import { checkValidationResults } from "./handleValidationErrors.js";

export const validateTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 100 })
    .withMessage("Task title must not exceed 100 characters"),
  body("projectId")
    .isInt()
    .withMessage("Project ID must be a valid integer"),
  body("status")
    .optional()
    .trim()
    .isIn(["Todo", "In Progress", "Done"])
    .withMessage("Status must be 'Todo', 'In Progress', or 'Done'"),
  body("assigneeId")
    .optional()
    .isInt()
    .withMessage("Assignee ID must be a valid integer"),
  checkValidationResults,
];

export const validateTaskUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Task title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Task title must not exceed 100 characters"),
  body("status")
    .optional()
    .trim()
    .isIn(["Todo", "In Progress", "Done"])
    .withMessage("Status must be 'Todo', 'In Progress', or 'Done'"),
  body("assigneeId")
    .optional()
    .isInt()
    .withMessage("Assignee ID must be a valid integer"),
  checkValidationResults,
];
