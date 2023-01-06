import { prisma } from "@/config";
import { Activities, ActivitySubscription } from "@prisma/client";

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

async function create(
  { activityId, ticketId }: CreateParams,
  vacancy: number,
): Promise<[ActivitySubscription, Activities]> {
  return prisma.$transaction([
    prisma.activitySubscription.create({
      data: {
        activityId,
        ticketId,
      },
    }),
    prisma.activities.update({
      where: {
        id: activityId,
      },
      data: {
        vacancy: vacancy - 1,
      },
    }),
  ]);
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
  const plus1day = new Date(date.setDate(date.getDate() + 1));
  const today = new Date(date.setDate(date.getDate() - 1));
  return prisma.activitiesVenue.findMany({
    include: {
      Activities: {
        where: {
          date: {
            gte: today,
            lt: plus1day,
          },
        },
        orderBy: {
          startsAt: "asc",
        },
        include: {
          ActivitySubscription: true,
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

async function deleteSubscription(SubscriptionId: number, vacancy: number, activityId: number) {
  prisma.$transaction([
    prisma.activitySubscription.delete({
      where: {
        id: SubscriptionId,
      },
    }),
    prisma.activities.update({
      where: {
        id: activityId,
      },
      data: {
        vacancy: vacancy + 1,
      },
    }),
  ]);
}

async function updateVacancy(vacancy: number, id: number) {
  return prisma.activities.update({
    where: {
      id,
    },
    data: {
      vacancy,
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
  updateVacancy,
};

export default activitiesRepository;
