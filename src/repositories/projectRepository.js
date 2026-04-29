import prisma from "../config/db.js";

export const createProject = async (name, description, userId) => {
  return await prisma.project.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId,
          role: "Owner",
        },
      },
    },
  });
};

export const getProjectsByUserId = async (userId) => {
  return await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });
};

export const getProjectById = async (id) => {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      members: true,
      tasks: true,
    },
  });
};

export const updateProject = async (id, data) => {
  return await prisma.project.update({
    where: { id },
    data,
  });
};

export const deleteProject = async (id) => {
  return await prisma.project.delete({
    where: { id },
  });
};

export const findProjectMember = async (projectId, userId) => {
  return await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
};
