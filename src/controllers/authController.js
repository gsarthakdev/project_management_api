import * as authService from "../services/authService.js";

export async function signup(req, res, next) {
  const { name, email, password } = req.body;
  const user = await authService.signup(name, email, password);
  res.status(201).json(user);
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json(result);
}
