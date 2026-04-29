import express from "express";
import * as taskController from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateTask, validateTaskUpdate } from "../middleware/validateTask.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validateTask, taskController.createTask);
router.get("/", taskController.getMyTasks);
router.get("/:id", taskController.getTaskDetails);
router.put("/:id", validateTaskUpdate, taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
