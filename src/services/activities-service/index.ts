import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { cannotSubscribeError, notFoundError } from "@/errors";
import tikectRepository from "@/repositories/ticket-repository";

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotSubscribeError();
  }
  const ticket = await tikectRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote) {
    throw cannotSubscribeError();
  }
  return ticket.id;
}

async function checkValidActivity(activityId: number, ticketId: number) {
  const activity = await activitiesRepository.findByActivityId(activityId);

  const userActivitiesPerDay = await activitiesRepository.findByActivityDateAndTicket(activity.date, ticketId);
  if (!activity) {
    throw notFoundError();
  }
  const unavailableTime =
    userActivitiesPerDay.filter(
      (el) =>
        (activity.startsAt >= el.startsAt && activity.startsAt < el.endsAt) ||
        (activity.endsAt > el.startsAt && activity.endsAt < el.endsAt),
    ).length > 0;

  if (unavailableTime) {
    throw cannotSubscribeError();
  }
  return activity;
}

async function listActivities() {
  const activities = await activitiesRepository.findActivities();
  return activities;
}

async function createSubscription(userId: number, activityId: number) {
  const ticketId = await checkEnrollmentTicket(userId);
  const activity = await checkValidActivity(activityId, ticketId);
  return activitiesRepository.create({ activityId, ticketId }, activity.vacancy);
}

async function findSubscriptionByTicketAndActivityIds(activityId: number, ticketId: number) {
  const activitie = await activitiesRepository.findByTicketAndActivityId(activityId, ticketId);
  return activitie;
}

async function getDays() {
  const days = await activitiesRepository.findDays();
  return days;
}

async function getActivitiesByDay(date: Date) {
  const activities = await activitiesRepository.findActivitiesByDay(date);
  if (!activities) {
    throw notFoundError();
  }
  return activities;
}

async function deleteActivityById(userId: number, activityId: number) {
  const ticketId = await checkEnrollmentTicket(userId);
  const isUserActivity = await activitiesRepository.findByTicketAndActivityId(activityId, ticketId);
  const activity = await activitiesRepository.findByActivityId(activityId);
  if (!isUserActivity) {
    throw cannotSubscribeError();
  }

  return activitiesRepository.deleteSubscription(isUserActivity.id, activity.vacancy, activity.id);
}

const activitiesService = {
  listActivities,
  createSubscription,
  findSubscriptionByTicketAndActivityIds,
  getDays,
  getActivitiesByDay,
  deleteActivityById,
};

export default activitiesService;
