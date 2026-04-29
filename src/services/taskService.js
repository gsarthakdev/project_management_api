import * as taskRepository from "../repositories/taskRepository.js";
import * as projectRepository from "../repositories/projectRepository.js";

export const createTask = async (data, userId) => {
  const member = await projectRepository.findProjectMember(data.projectId, userId);
  if (!member) {
    throw { status: 403, message: "Forbidden: Not a member of this project" };
  }

  // Check for duplicate task title in project
  const existingTask = await taskRepository.findTaskByTitleInProject(
    data.title,
    data.projectId
  );
  if (existingTask) {
    throw { status: 409, message: "A task with this title already exists in this project" };
  }

  return await taskRepository.createTask(data);
};

export const getMyTasks = async (userId) => {
  return await taskRepository.getTasksByAssigneeId(userId);
};

export const getTaskDetails = async (taskId, userId) => {
  const task = await taskRepository.getTaskById(taskId);
  if (!task) throw { status: 404, message: "Task not found" };

  const member = await projectRepository.findProjectMember(task.projectId, userId);
  if (!member) {
    throw { status: 403, message: "Forbidden: No access to this project" };
  }

  return task;
};

export const updateTask = async (taskId, userId, data) => {
  const task = await taskRepository.getTaskById(taskId);
  if (!task) throw { status: 404, message: "Task not found" };

  const member = await projectRepository.findProjectMember(task.projectId, userId);
  if (!member) {
    throw { status: 403, message: "Forbidden: No access to this project" };
  }

  // Logic: Assignee can update status, Admin/Owner can update anything
  // For simplicity, we just check if member exists for generic update permissions
  // but we could be more specific.
  
  return await taskRepository.updateTask(taskId, data);
};

export const deleteTask = async (taskId, userId) => {
  const task = await taskRepository.getTaskById(taskId);
  if (!task) throw { status: 404, message: "Task not found" };

  const member = await projectRepository.findProjectMember(task.projectId, userId);
  if (!member || (member.role !== "Owner" && member.role !== "Admin")) {
    throw { status: 403, message: "Forbidden: Insufficient permissions to delete tasks" };
  }

  await taskRepository.deleteTask(taskId);
};
