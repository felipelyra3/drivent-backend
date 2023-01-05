import { prisma } from "@/config";
import { ActivitySubscription } from "@prisma/client";
import { number } from "joi";

type CreateParams = Omit<ActivitySubscription, "id">;

async function findActivities() {
  return prisma.activities.findMany();
}

async function findByActivityId(activityId: number) {
  return prisma.activities.findFirst({
    where: {
      id: activityId,
    },
  });
}

async function create({ activityId, ticketId }: CreateParams): Promise<ActivitySubscription> {
  return prisma.activitySubscription.create({
    data: {
      activityId,
      ticketId,
    },
  });
}

async function findByTicketAndActivityId(activityId: number, ticketId: number) {
  return prisma.activitySubscription.findFirst({
    where: {
      activityId: activityId,
      ticketId: ticketId,
    },
  });
}

async function findDays() {
  return prisma.activities.groupBy({
    by: ["date"],
    orderBy: {
      date: "asc",
    },
  });
}

async function findActivitiesByDay(date: Date) {
  return prisma.activitiesVenue.findMany({
    include: {
      Activities: {
        where: {
          date,
        },
        orderBy: {
          startsAt: "asc",
        },
      },
    },
  });
}

async function findByActivityDateAndTicket(date: Date, ticketId: number) {
  return prisma.activities.findMany({
    where: {
      date,
    },
    include: {
      ActivitySubscription: {
        where: {
          ticketId,
        },
      },
    },
  });
}

async function deleteSubscription(id: number) {
  return prisma.activitySubscription.delete({
    where: {
      id,
    },
  });
}

const activitiesRepository = {
  findActivities,
  create,
  findByActivityId,
  findByTicketAndActivityId,
  findDays,
  findActivitiesByDay,
  findByActivityDateAndTicket,
  deleteSubscription,
};

export default activitiesRepository;
