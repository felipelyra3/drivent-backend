import app, { init } from "@/app";
import { loadEnv, connectDb, disconnectDB } from "@/config";
import { TicketStatus } from "@prisma/client";
import faker from "@faker-js/faker";
import { prisma } from "@/config";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createBooking,
  createTicketTypeWithoutHotel,
  createTicketTypeRemote,
  createHotel,
} from "../tests/factories";

async function createRoom(hotelId: number, roomname: string) {
  return prisma.room.create({
    data: {
      name: roomname,
      capacity: Math.floor(Math.random() * (3 - 1 + 1) + 1), //entre 1 e 3
      hotelId: hotelId,
    },
  });
}

async function createActivityVenue(name: string) {
  return prisma.activitiesVenue.create({
    data: {
      name: name,
    }
  });
}

async function createActivity(name: string, startsAt: string, endsAt: string, vacancy: number, venue: number) {
  return prisma.activities.create({
    data: {
      name: name,
      startsAt: startsAt,
      endsAt: endsAt,
      vacancy: vacancy,
      venue: venue,
      date: faker.date.between("2023-01-06T00:00:00.000Z", "2023-01-08T00:00:00.000Z"),
    }
  });
}

async function createdata() {
  const ticketType = await createTicketTypeWithHotel();
  await createTicketTypeWithoutHotel();
  await createTicketTypeRemote();
  const ticket = await createTicket(1, ticketType.id, TicketStatus.PAID); // parametro 1 representa o id do enrollment
  const payment = await createPayment(ticket.id, ticketType.price);
  const createdHotel1 = await createHotel();
  createRooms(createdHotel1.id);
  const createdHotel2 = await createHotel();
  createRooms(createdHotel2.id);
  const createdHotel3 = await createHotel();
  createRooms(createdHotel3.id);
  createActivityVenue("Auditório Principal");
  createActivityVenue("Auditório Lateral");
  createActivityVenue("Sala de Workshop");
}

async function createRooms(hotelid: number) {
  for (let i = 0; i < 50; i++) {
    const room = await createRoom(hotelid, `${i + 1}`);
    if (i % 2 === 0) {
      const newuser = await createUser();
      await createBooking({
        userId: newuser.id,
        roomId: room.id,
      });
    }
  }
}

loadEnv();
const port = +process.env.PORT || 4000;
init().then(() => {
  createdata();
});
