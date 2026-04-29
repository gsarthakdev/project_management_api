import prisma from "../config/db.js";

export const createComment = async (data) => {
  return await prisma.comment.create({
    data,
  });
};

export const getCommentsByAuthorId = async (authorId) => {
  return await prisma.comment.findMany({
    where: { authorId },
  });
};

export const getCommentById = async (id) => {
  return await prisma.comment.findUnique({
    where: { id },
    include: {
      task: {
        include: {
          project: true,
        },
      },
    },
  });
};

export const updateComment = async (id, content) => {
  return await prisma.comment.update({
    where: { id },
    data: { content },
  });
};

export const deleteComment = async (id) => {
  return await prisma.comment.delete({
    where: { id },
  });
};
