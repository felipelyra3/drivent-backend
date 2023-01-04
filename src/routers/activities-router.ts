import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { activitySubscription, getActivities } from "@/controllers/activities-controller";

const activitiesRouter = Router();

activitiesRouter.all("/*", authenticateToken).get("/", getActivities).post("/registration", activitySubscription);

export { activitiesRouter };
