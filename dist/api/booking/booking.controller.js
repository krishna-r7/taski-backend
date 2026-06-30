"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booking_service_1 = __importDefault(require("./booking.service"));
class BookingController {
    async reserveSeats(req, res, next) {
        try {
            const userId = req.user.userId;
            // console.log('sssss',userId, 'user id');
            const { eventId, seatIds } = req.body;
            if (!eventId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
                res.status(400).json({
                    success: false,
                    message: "eventId and seatIds are required",
                });
                return;
            }
            const result = await booking_service_1.default.reserveSeats(userId, eventId, seatIds);
            res.status(200).json({
                status_code: 200,
                message: "Seats reserved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async confirmBooking(req, res, next) {
        try {
            const userId = req.user.userId;
            const { eventId, bookingId } = req.body;
            if (!bookingId) {
                res.status(400).json({
                    success: false,
                    message: "bookingId is required",
                });
                return;
            }
            const booking = await booking_service_1.default.confirmBooking(userId, 
            // eventId,
            bookingId);
            res.status(200).json({
                status_code: 200,
                message: "Booking confirmed successfully",
                data: booking,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getBookingHistory(req, res, next) {
        try {
            const userId = req.user.id;
            const bookings = await booking_service_1.default.getBookingHistory(userId);
            res.status(200).json({
                success: true,
                count: bookings.length,
                data: bookings,
            });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getBookingDetail(req, res, next) {
        try {
            const userId = req.user.userId;
            const bookingId = req.params.id;
            const booking = await booking_service_1.default.getBookingDetail(userId, bookingId);
            res.status(200).json({
                success: true,
                data: booking,
            });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getBookings(req, res) {
        try {
            const userId = req.user.userId;
            const result = await booking_service_1.default.getBookingsHistory(userId, req);
            return res.status(200).json({
                status_code: 200,
                ...result,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getAllUserBookings(req, res) {
        try {
            const result = await booking_service_1.default.getAllUserBookings(req);
            return res.status(200).json({
                status_code: 200,
                ...result,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async cancelBooking(req, res) {
        try {
            // const userId = (req as any).user.userId;
            const bookingId = req.params.id;
            const result = await booking_service_1.default.cancelBooking(bookingId);
            return res.status(200).json({
                status_code: 200,
                message: "Booking cancelled successfully",
                ...result,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async refundBooking(req, res) {
        try {
            const bookingId = req.params.id;
            const result = await booking_service_1.default.refundBooking(bookingId);
            return res.status(200).json({
                status_code: 200,
                message: "Booking refunded successfully",
                ...result,
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = new BookingController();
