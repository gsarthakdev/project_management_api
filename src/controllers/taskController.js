import * as taskService from "../services/taskService.js";

export async function createTask(req, res, next) {
  const task = await taskService.createTask(req.body, req.user.userId);
  res.status(201).json(task);
}

export async function getMyTasks(req, res, next) {
  const tasks = await taskService.getMyTasks(req.user.userId);
  res.json(tasks);
}

export async function getTaskDetails(req, res, next) {
  const task = await taskService.getTaskDetails(
    parseInt(req.params.id),
    req.user.userId
  );
  res.json(task);
}

export async function updateTask(req, res, next) {
  const task = await taskService.updateTask(
    parseInt(req.params.id),
    req.user.userId,
    req.body
  );
  res.json(task);
}

export async function deleteTask(req, res, next) {
  await taskService.deleteTask(parseInt(req.params.id), req.user.userId);
  res.status(204).send();
}
