import * as projectRepository from "../repositories/projectRepository.js";

export const createProject = async (name, description, userId) => {
  // Check if project with same name already exists for this user (membership check)
  // Note: The requirement was 409 Conflict if duplicate project name exists.
  // In a membership model, I should check if a project with this name exists where the user is already a member.
  const userProjects = await projectRepository.getProjectsByUserId(userId);
  const duplicate = userProjects.find((p) => p.name === name);
  if (duplicate) {
    throw { status: 409, message: "A project with this name already exists for you" };
  }

  return await projectRepository.createProject(name, description, userId);
};

export const getMyProjects = async (userId) => {
  return await projectRepository.getProjectsByUserId(userId);
};

export const getProjectDetails = async (projectId, userId) => {
  const project = await projectRepository.getProjectById(projectId);
  if (!project) throw { status: 404, message: "Project not found" };

  const member = project.members.find(m => m.userId === userId);
  if (!member) {
    throw { status: 403, message: "Forbidden: Not a member of this project" };
  }

  return project;
};

export const updateProject = async (projectId, userId, data) => {
  const project = await projectRepository.getProjectById(projectId);
  if (!project) throw { status: 404, message: "Project not found" };

  const member = project.members.find(m => m.userId === userId);
  if (!member || (member.role !== "Owner" && member.role !== "Admin")) {
    throw { status: 403, message: "Forbidden: Insufficient permissions" };
  }

  return await projectRepository.updateProject(projectId, data);
};

export const deleteProject = async (projectId, userId) => {
  const project = await projectRepository.getProjectById(projectId);
  if (!project) throw { status: 404, message: "Project not found" };

  const member = project.members.find(m => m.userId === userId);
  if (!member || member.role !== "Owner") {
    throw { status: 403, message: "Forbidden: Only owners can delete projects" };
  }

  await projectRepository.deleteProject(projectId);
};
