import * as commentRepository from "../repositories/commentRepository.js";
import * as taskRepository from "../repositories/taskRepository.js";
import * as projectRepository from "../repositories/projectRepository.js";

export const createComment = async (data, userId) => {
  const task = await taskRepository.getTaskById(data.taskId);
  if (!task) throw { status: 404, message: "Task not found" };

  const member = await projectRepository.findProjectMember(task.projectId, userId);
  if (!member) {
    throw { status: 403, message: "Forbidden: No access to this project" };
  }

  return await commentRepository.createComment({ ...data, authorId: userId });
};

export const getMyComments = async (userId) => {
  return await commentRepository.getCommentsByAuthorId(userId);
};

export const getCommentDetails = async (commentId, userId) => {
  const comment = await commentRepository.getCommentById(commentId);
  if (!comment) throw { status: 404, message: "Comment not found" };

  const member = await projectRepository.findProjectMember(
    comment.task.projectId,
    userId
  );
  if (!member) {
    throw { status: 403, message: "Forbidden: No access to this project" };
  }

  return comment;
};

export const updateComment = async (commentId, userId, content) => {
  const comment = await commentRepository.getCommentById(commentId);
  if (!comment) throw { status: 404, message: "Comment not found" };

  if (comment.authorId !== userId) {
    throw { status: 403, message: "Forbidden: Only the author can edit this comment" };
  }

  return await commentRepository.updateComment(commentId, content);
};

export const deleteComment = async (commentId, userId) => {
  const comment = await commentRepository.getCommentById(commentId);
  if (!comment) throw { status: 404, message: "Comment not found" };

  const member = await projectRepository.findProjectMember(
    comment.task.projectId,
    userId
  );
  
  // Logic: Author OR Project Owner can delete
  if (comment.authorId !== userId && (!member || member.role !== "Owner")) {
    throw { status: 403, message: "Forbidden: Insufficient permissions to delete" };
  }

  await commentRepository.deleteComment(commentId);
};
