import * as projectService from "../services/projectService.js";

export async function createProject(req, res, next) {
  const { name, description } = req.body;
  const project = await projectService.createProject(
    name,
    description,
    req.user.userId
  );
  res.status(201).json(project);
}

export async function getMyProjects(req, res, next) {
  const projects = await projectService.getMyProjects(req.user.userId);
  res.json(projects);
}

export async function getProjectDetails(req, res, next) {
  const project = await projectService.getProjectDetails(
    parseInt(req.params.id),
    req.user.userId
  );
  res.json(project);
}

export async function updateProject(req, res, next) {
  const project = await projectService.updateProject(
    parseInt(req.params.id),
    req.user.userId,
    req.body
  );
  res.json(project);
}

export async function deleteProject(req, res, next) {
  await projectService.deleteProject(parseInt(req.params.id), req.user.userId);
  res.status(204).send();
}
