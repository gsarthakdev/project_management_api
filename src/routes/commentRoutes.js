import express from "express";
import * as commentController from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validateComment, validateCommentUpdate } from "../middleware/validateComment.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", validateComment, commentController.createComment);
router.get("/", commentController.getMyComments);
router.get("/:id", commentController.getCommentDetails);
router.put("/:id", validateCommentUpdate, commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

export default router;
