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

  const filteredActivities = userActivitiesPerDay.filter((el) => el.ActivitySubscription.length != 0);

  if (!activity) {
    throw notFoundError();
  }

  const unavailableTime =
    filteredActivities.filter(
      (el) =>
        (activity.startsAt >= el.startsAt && activity.startsAt < el.endsAt) ||
        (activity.endsAt > el.startsAt && activity.endsAt < el.endsAt),
    ).length > 0;

  console.log(unavailableTime);

  if (unavailableTime) {
    throw cannotSubscribeError();
  }

  return userActivitiesPerDay;
}

async function listActivities() {
  const activities = await activitiesRepository.findActivities();
  return activities;
}

async function createSubscription(userId: number, activityId: number) {
  const ticketId = await checkEnrollmentTicket(userId);
  const dayActivities = await checkValidActivity(activityId, ticketId);

  //return activitiesRepository.create({ activityId, ticketId });
  return dayActivities;
}

const activitiesService = {
  listActivities,
  createSubscription,
};

export default activitiesService;
