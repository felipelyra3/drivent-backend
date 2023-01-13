import { prisma, redis } from "@/config";
import { Activities, ActivitySubscription } from "@prisma/client";

type CreateParams = Omit<ActivitySubscription, "id">;

async function findActivities() {
  let activities = await redis.get("activities");
  if (!activities || activities === "{}" || activities === "null") {
    activities = JSON.stringify(await prisma.activities.findMany());
    await redis.set("activities", activities);
    return JSON.parse(activities);
  }

  return JSON.parse(activities);
}

async function findByActivityId(activityId: number) {
  let activity = await redis.get(`activity${activityId}`);
  if (!activity || activity === "{}" || activity === "null") {
    activity = JSON.stringify(
      await prisma.activities.findFirst({
        where: {
          id: activityId,
        },
      }),
    );
    await redis.set(`activity${activityId}`, activity);
  }
  return JSON.parse(activity);
}

async function create(
  { activityId, ticketId }: CreateParams,
  vacancy: number,
): Promise<[ActivitySubscription, Activities]> {
  await redis.flushAll();
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
  let activity = await redis.get(`activity${activityId}and${ticketId}`);
  if (!activity || activity === "{}" || activity === "null") {
    activity = JSON.stringify(
      await prisma.activitySubscription.findFirst({
        where: {
          activityId: activityId,
          ticketId: ticketId,
        },
      }),
    );
    await redis.set(`activity${activityId}and${ticketId}`, activity);
  }
  return JSON.parse(activity);
}

async function findDaysquery() {
  return prisma.activities.groupBy({
    by: ["date"],
    orderBy: {
      date: "asc",
    },
  });
}

async function findDays(): Promise<{ date: Date }[]> {
  let days = await redis.get("activitydays");
  if (!days || days === "{}" || days === "null" || days === "[]") {
    days = JSON.stringify(await findDaysquery());
    await redis.set("activitydays", days);
  }
  return JSON.parse(days);
}

async function findActivitiesByDayquery(date: Date) {
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

async function findActivitiesByDay(date: Date) {
  let activities = await redis.get(`activities${date}`);
  if (!activities || activities === "{}" || activities === "null" || activities === "[]") {
    activities = JSON.stringify(await findActivitiesByDayquery(date));
    await redis.set(`activities${date}`, activities);
  }
  return JSON.parse(activities);
}

async function findByActivityDateAndTicketquery(
  date: Date,
  ticketId: number,
): Promise<{ startsAt: string; endsAt: string }[]> {
  const datetext = date.toISOString().slice(0, 10) + "%";
  return prisma.$queryRaw`SELECT "Activities"."startsAt", "Activities"."endsAt" FROM "ActivitySubscription" JOIN "Activities" ON "ActivitySubscription"."activityId" = "Activities"."id"
  WHERE "Activities".date::text LIKE ${datetext} AND "ActivitySubscription"."ticketId"=${ticketId};`;
}

async function findByActivityDateAndTicket(
  date: Date,
  ticketId: number,
): Promise<{ startsAt: string; endsAt: string }[]> {
  let activity = await redis.get(`activitydate${date}andticket${ticketId}`);
  if (!activity || activity === "{}" || activity === "[]" || activity === "null") {
    activity = JSON.stringify(await findByActivityDateAndTicketquery(date, ticketId));
    await redis.set(`activitydate${date}andticket${ticketId}`, activity);
  }
  return JSON.parse(activity);
}

async function deleteSubscription(SubscriptionId: number, vacancy: number, activityId: number) {
  await redis.flushAll();
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
