import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  try {
    const activities = await activitiesService.listActivities();
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }         
}
