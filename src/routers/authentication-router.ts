import { singInPost } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInSchema } from "@/schemas";
import { Router } from "express";
import { singInGitHubPost } from "@/controllers/authentication-github-controller";

const authenticationRouter = Router();

authenticationRouter
  .post("/sign-in/github", singInGitHubPost)
  .post("/sign-in", validateBody(signInSchema), singInPost);

export { authenticationRouter };
