"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_service_1 = __importDefault(require("./event.service"));
class EventController {
    async create(req, res) {
        const event = await event_service_1.default.createEvent(req.body);
        res.status(200).json({
            status_code: 200,
            data: event,
            message: "Event created",
        });
    }
    async getUpcomingEvents(req, res) {
        try {
            const events = await event_service_1.default.getEvents(req);
            res.status(200).json({
                status_code: 200,
                data: events,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getAllEvents(req, res) {
        try {
            const events = await event_service_1.default.getAllEvents(req);
            res.status(200).json({
                status_code: 200,
                data: events,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getAllEventsName(req, res) {
        try {
            const events = await event_service_1.default.getAllEventsName();
            res.status(200).json({
                status_code: 200,
                data: events,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getOne(req, res) {
        const event = await event_service_1.default.getEvent(req.params.id);
        res.status(200).json({ status_code: 200, data: event });
    }
    async update(req, res) {
        const event = await event_service_1.default.updateEvent(req.params.id, req.body);
        res.status(200).json({
            status_code: 200,
            data: event,
            message: "Event updated",
        });
    }
    async delete(req, res) {
        await event_service_1.default.deleteEvent(req.params.id);
        res.status(200).json({
            status_code: 200,
            message: "Event deleted",
        });
    }
    async seats(req, res) {
        const seats = await event_service_1.default.getSeats(req.params.id);
        res.status(200).json({
            status_code: 200,
            data: seats,
        });
    }
}
exports.default = new EventController();
