import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { activitySubscription, getActivities, getActivitiesByDay, getDays } from "@/controllers/activities-controller";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getActivities)
  .post("/registration", activitySubscription)
  .get("/days", getDays)
  .get("/days/:date", getActivitiesByDay);

export { activitiesRouter };
