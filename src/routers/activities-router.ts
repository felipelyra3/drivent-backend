import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import {
  activitySubscription,
  getActivities,
  userHasSubscripted,
  getActivitiesByDay,
  getDays,
} from "@/controllers/activities-controller";
const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getActivities)
  .get("/:activityId", userHasSubscripted)
  .post("/subscription", activitySubscription)
  .get("/days", getDays)
  .get("/days/:date", getActivitiesByDay);

export { activitiesRouter };
