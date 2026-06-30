import { Router } from "express";
import eventController from "./event.controller";

const router = Router();

router.post("/",  eventController.create);

router.get("/", eventController.getAllEvents);

router.get("/upcoming-events", eventController.getUpcomingEvents);

router.get("/EventNames", eventController.getAllEventsName);

router.get("/:id", eventController.getOne);

router.put("/:id",  eventController.update);

router.delete("/:id",  eventController.delete);

router.get("/:id/seats", eventController.seats);




export default router;