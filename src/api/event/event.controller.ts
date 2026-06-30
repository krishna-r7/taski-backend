import { Request, Response } from "express";
import eventService from "./event.service";

class EventController {

  async create(req: Request, res: Response) {

    const event = await eventService.createEvent(req.body);

    res.status(200).json({
      status_code: 200,
      data: event,
      message: "Event created",
    });

  }

  async getUpcomingEvents(req: Request, res: Response) {
    try {

      const events = await eventService.getEvents(req);

      res.status(200).json({
        status_code: 200,
        data: events,
      });
    } catch (error) {
      throw error;
    }

  }


  async getAllEvents(req: Request, res: Response) {
    try {

      const events = await eventService.getAllEvents(req);

      res.status(200).json({
        status_code: 200,
        data: events,
      });
    } catch (error) {
      throw error;
    }

  }

   async getAllEventsName(req: Request, res: Response) {
    try {

      const events = await eventService.getAllEventsName();

      res.status(200).json({
        status_code: 200,
        data: events,
      });
      
    } catch (error) {
      throw error;
    }
  }

  async getOne(req: Request, res: Response) {

    const event = await eventService.getEvent(req.params.id as string);
    res.status(200).json({ status_code: 200, data: event });

  }

  async update(req: Request, res: Response) {

    const event = await eventService.updateEvent(
      req.params.id as string,
      req.body
    );

    res.status(200).json({
      status_code: 200,
      data: event,
      message: "Event updated",
    });

  }

  async delete(req: Request, res: Response) {

    await eventService.deleteEvent(req.params.id as string);

    res.status(200).json({
      status_code: 200,
      message: "Event deleted",
    });

  }

  async seats(req: Request, res: Response) {

    const seats = await eventService.getSeats(
      req.params.id as string
    );

    res.status(200).json({
      status_code: 200,
      data: seats,
    });

  }

}

export default new EventController();