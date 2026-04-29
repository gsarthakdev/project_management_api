import express from "express";
import * as projectController from "../controllers/projectController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateProject } from "../middleware/validateProject.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validateProject, projectController.createProject);
router.get("/", projectController.getMyProjects);
router.get("/:id", projectController.getProjectDetails);
router.put("/:id", validateProject, projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;
