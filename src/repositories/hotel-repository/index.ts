import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findHotelVacancies(
  id: number,
): Promise<{ hotelId: number; totalBookings: number; totalCapacity: number; vacancies: number }[]> {
  return prisma.$queryRaw`SELECT "Hotel".id As "hotelId", Sum(b.capacity) AS "totalCapacity", SUM(b.ocupados) AS "totalBookings", Sum(b.capacity) - SUM(b.ocupados) AS vacancies FROM "Hotel" LEFT JOIN (SELECT "Room".capacity, "Room"."hotelId", Count("Booking"."roomId") AS ocupados FROM "Room" LEFT JOIN "Booking" ON "Booking"."roomId" = "Room".id GROUP BY "Booking"."roomId", "Room".id) AS b ON "Hotel".id = b."hotelId" WHERE "Hotel".id =${id} GROUP BY "Hotel".id;
`;
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  findHotelVacancies,
};

export default hotelRepository;
