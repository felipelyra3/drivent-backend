import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createActivity(venueId: number) {
  return await prisma.activities.create({
    data: {
      name: faker.name.findName(),
      date: faker.date.future(),
      startsAt: "9:00",
      endsAt: "10:00",
      vacancy: 30,
      venue: venueId,
    },
  });
}

export async function createActivitiesWithDate(venueId: number, date: Date, startsAt: string, endsAt: string) {
  return await prisma.activities.create({
    data: {
      name: faker.name.findName(),
      date: date,
      startsAt: startsAt,
      endsAt: endsAt,
      vacancy: 30,
      venue: venueId,
    },
  });
}

export async function createVenue() {
  return await prisma.activitiesVenue.create({
    data: {
      name: faker.name.findName(),
    },
  });
}

export async function createSubscription(activityId: number, ticketId: number) {
  return await prisma.activitySubscription.create({
    data: {
      activityId: activityId,
      ticketId: ticketId,
    },
  });
}
