import prisma from "../config/db.js";

export const createTask = async (data) => {
  return await prisma.task.create({
    data,
  });
};

export const getTasksByAssigneeId = async (assigneeId) => {
  return await prisma.task.findMany({
    where: { assigneeId },
  });
};

export const getTaskById = async (id) => {
  return await prisma.task.findUnique({
    where: { id },
    include: {
      comments: true,
      project: true,
    },
  });
};

export const updateTask = async (id, data) => {
  return await prisma.task.update({
    where: { id },
    data,
  });
};

export const deleteTask = async (id) => {
  return await prisma.task.delete({
    where: { id },
  });
};

export const findTaskByTitleInProject = async (title, projectId) => {
  return await prisma.task.findFirst({
    where: {
      title,
      projectId,
    },
  });
};
