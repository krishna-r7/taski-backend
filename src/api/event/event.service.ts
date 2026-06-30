import Event from "./event.model";
import Seat from "./seat.model";
import { Request } from "express";

class EventService {

  async createEvent(data: any) {
    try {

      // Check if the event date is in the past
      if (data.eventDate < new Date()) {
        throw new Error("Event date cannot be in the past");
      }

    const event = await Event.create(data);

    const seats = [];

    for (let i = 1; i <= data.totalSeats; i++) {

      seats.push({
        event: event._id,
        seatNumber: `S${i}`,
        seatIndex: i,
      });

    }

    await Seat.insertMany(seats);

    return event;
    } catch (error) {
      throw error;
    }

  }

  async getEvents(req: Request) {

    let {page, limit} = req.query as any;
    page = page || 1;
    limit = limit || 10;

    const skip = (page - 1) * limit;
    const currentDate = new Date();
    const query = {
      eventDate: {
        $gte: currentDate,
      },
      isDeleted: false,
    };

    const total = await Event.countDocuments(query);

    const events = await Event.find(query).sort({ eventDate: 1 }).skip(skip).limit(limit);

    return {
      total,
      currentPage: page,
      limit,
      totalPages: Math.ceil(total / limit),
      events,
    };

  }


   async getAllEvents(req: Request) {

    let {page, limit} = req.query as any;
    page = page || 1;
    limit = limit || 10;

    const skip = (page - 1) * limit;
    const query = {
      isDeleted: false,
    };

    const total = await Event.countDocuments(query);

    const events = await Event.find(query).sort({ eventDate: 1 }).skip(skip).limit(limit);

    return {
      pagination: {
        total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      events,
    };

  }

  async getAllEventsName() {
    const events = await Event.find().sort({ eventDate: 1 }).select('title eventDate isDeleted ');
    return events;
  }


  async getEvent(id: string) {

    return Event.findById(id);

  }

  async updateEvent(id: string, data: any) {

    return Event.findByIdAndUpdate(id, data, {
      new: true,
    });

  }

  async deleteEvent(id: string) {

    await Seat.updateMany(
      {
        event: id,
      },
      {
        $set: {
          isDeleted: true,
        },
      }
    );

    return Event.findByIdAndUpdate(id, {
      isDeleted: true,
    });

  }

  async getSeats(eventId: string) {

    const now = new Date();

    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const hasExpired = await Seat.exists({
      event: eventId,
      status: 'RESERVED',
      reservedUntil: { $lte: now },
    });


    if (hasExpired) {
      await Seat.updateMany(
        {
          event: eventId,
          status: 'RESERVED',
          reservedUntil: { $lte: now },
        },
        {
          $set: {
            status: 'AVAILABLE',
            reservedBy: null,
            reservedUntil: null,
          },
        }
      );
    }

    const seats = await Seat.find({ event: eventId }).sort({ seatIndex: 1 });
    return {
      event,
      seats,
    };

  }



}

export default new EventService();