import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { cannotListActivitiesError, cannotSubscribeError, notFoundError } from "@/errors";
import tikectRepository from "@/repositories/ticket-repository";
import dayjs from "dayjs";

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

  //TODO: checar horário vago...

  if (!activity) {
    throw notFoundError();
  }
  /* if (ja tiver atividade no horário) {
    throw cannotSubscribeError();
  } */
}

async function listActivities() {
  const activities = await activitiesRepository.findActivities();
  return activities;
}

async function createSubscription(userId: number, activityId: number) {
  const ticketId = await checkEnrollmentTicket(userId);
  await checkValidActivity(activityId, ticketId);

  return activitiesRepository.create({ activityId, ticketId });
}

async function getDays() {
  const days = await activitiesRepository.findDays();
  return days;
}

async function getActivitiesByDay(date: Date) {
  const activities = await activitiesRepository.findActivitiesByDay(date);
  if(!activities) {
    throw notFoundError();
  }
  return activities;
}

const activitiesService = {
  listActivities,
  createSubscription,
  getDays,
  getActivitiesByDay
};

export default activitiesService;
