import * as commentService from "../services/commentService.js";

export async function createComment(req, res, next) {
  const comment = await commentService.createComment(req.body, req.user.userId);
  res.status(201).json(comment);
}

export async function getMyComments(req, res, next) {
  const comments = await commentService.getMyComments(req.user.userId);
  res.json(comments);
}

export async function getCommentDetails(req, res, next) {
  const comment = await commentService.getCommentDetails(
    parseInt(req.params.id),
    req.user.userId
  );
  res.json(comment);
}

export async function updateComment(req, res, next) {
  const comment = await commentService.updateComment(
    parseInt(req.params.id),
    req.user.userId,
    req.body.content
  );
  res.json(comment);
}

export async function deleteComment(req, res, next) {
  await commentService.deleteComment(parseInt(req.params.id), req.user.userId);
  res.status(204).send();
}
