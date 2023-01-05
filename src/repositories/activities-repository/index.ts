import { prisma } from "@/config";
import { ActivitySubscription } from "@prisma/client";

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
      }
    }
  });
}

const activitiesRepository = {
  findActivities,
  create,
  findByActivityId,
  findDays,
  findActivitiesByDay
};

export default activitiesRepository;
