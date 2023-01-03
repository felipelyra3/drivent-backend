import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelsWithRooms, getVancacies } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getHotelsWithRooms)
  .get("/vacancies/:hotelId", getVancacies);

export { hotelsRouter };
