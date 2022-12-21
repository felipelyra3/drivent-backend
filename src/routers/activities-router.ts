import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivities } from "@/controllers/activities-controller";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getActivities);

export { activitiesRouter };
