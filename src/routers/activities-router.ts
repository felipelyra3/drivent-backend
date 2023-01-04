import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { activitySubscription, getActivities, userHasSubscripted } from "@/controllers/activities-controller";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getActivities)
  .get("/:activityId", userHasSubscripted)
  .post("/registration", activitySubscription);

export { activitiesRouter };
