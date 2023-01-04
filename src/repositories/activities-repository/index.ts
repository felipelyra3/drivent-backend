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

const activitiesRepository = {
  findActivities,
  create,
  findByActivityId,
};

export default activitiesRepository;
