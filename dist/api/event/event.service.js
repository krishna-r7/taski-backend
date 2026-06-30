"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_model_1 = __importDefault(require("./event.model"));
const seat_model_1 = __importDefault(require("./seat.model"));
class EventService {
    async createEvent(data) {
        try {
            // Check if the event date is in the past
            if (data.eventDate < new Date()) {
                throw new Error("Event date cannot be in the past");
            }
            const event = await event_model_1.default.create(data);
            const seats = [];
            for (let i = 1; i <= data.totalSeats; i++) {
                seats.push({
                    event: event._id,
                    seatNumber: `S${i}`,
                    seatIndex: i,
                });
            }
            await seat_model_1.default.insertMany(seats);
            return event;
        }
        catch (error) {
            throw error;
        }
    }
    async getEvents(req) {
        let { page, limit } = req.query;
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
        const total = await event_model_1.default.countDocuments(query);
        const events = await event_model_1.default.find(query).sort({ eventDate: 1 }).skip(skip).limit(limit);
        return {
            total,
            currentPage: page,
            limit,
            totalPages: Math.ceil(total / limit),
            events,
        };
    }
    async getAllEvents(req) {
        let { page, limit } = req.query;
        page = page || 1;
        limit = limit || 10;
        const skip = (page - 1) * limit;
        const query = {
            isDeleted: false,
        };
        const total = await event_model_1.default.countDocuments(query);
        const events = await event_model_1.default.find(query).sort({ eventDate: 1 }).skip(skip).limit(limit);
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
        const events = await event_model_1.default.find().sort({ eventDate: 1 }).select('title eventDate isDeleted ');
        return events;
    }
    async getEvent(id) {
        return event_model_1.default.findById(id);
    }
    async updateEvent(id, data) {
        return event_model_1.default.findByIdAndUpdate(id, data, {
            new: true,
        });
    }
    async deleteEvent(id) {
        await seat_model_1.default.updateMany({
            event: id,
        }, {
            $set: {
                isDeleted: true,
            },
        });
        return event_model_1.default.findByIdAndUpdate(id, {
            isDeleted: true,
        });
    }
    async getSeats(eventId) {
        const now = new Date();
        const event = await event_model_1.default.findById(eventId);
        if (!event) {
            throw new Error("Event not found");
        }
        const hasExpired = await seat_model_1.default.exists({
            event: eventId,
            status: 'RESERVED',
            reservedUntil: { $lte: now },
        });
        if (hasExpired) {
            await seat_model_1.default.updateMany({
                event: eventId,
                status: 'RESERVED',
                reservedUntil: { $lte: now },
            }, {
                $set: {
                    status: 'AVAILABLE',
                    reservedBy: null,
                    reservedUntil: null,
                },
            });
        }
        const seats = await seat_model_1.default.find({ event: eventId }).sort({ seatIndex: 1 });
        return {
            event,
            seats,
        };
    }
}
exports.default = new EventService();
