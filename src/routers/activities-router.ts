import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import {
  activitySubscription,
  userHasSubscripted,
  getActivitiesByDay,
  getDays,
  unsubscribeActivity,
} from "@/controllers/activities-controller";
const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getDays)
  .get("/:activityId", userHasSubscripted)
  .post("/subscription", activitySubscription)
  .get("/days/:date", getActivitiesByDay)
  .delete("/:activityId", unsubscribeActivity);

export { activitiesRouter };
