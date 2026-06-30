"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const event_model_1 = __importDefault(require("../event/event.model"));
const seat_model_1 = __importDefault(require("../event/seat.model"));
const booking_model_1 = __importDefault(require("./booking.model"));
const walletTrans_model_1 = __importDefault(require("../wallet/walletTrans.model"));
// import Wallet from "../wallet/walletTrans.model";
const user_model_1 = __importDefault(require("../user/user.model"));
const counter_model_1 = __importDefault(require("./counter.model"));
class BookingService {
    async releaseExpiredReservations() {
        await seat_model_1.default.updateMany({
            status: "RESERVED",
            reservedUntil: { $lt: new Date() },
        }, {
            $set: {
                status: "AVAILABLE",
                reservedBy: null,
                reservedUntil: null,
            },
        });
    }
    async getNextBookingId(session) {
        const counter = await counter_model_1.default.findByIdAndUpdate("booking", { $inc: { seq: 1 } }, { new: true, upsert: true, session });
        return `B${counter.seq}`;
    }
    ;
    async reserveSeats(userId, eventId, seatIds) {
        await this.releaseExpiredReservations();
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const event = await event_model_1.default.findById(eventId).session(session);
            if (!event) {
                throw new Error("Event not found");
            }
            const seats = await seat_model_1.default.find({
                _id: { $in: seatIds },
                event: eventId,
                status: "AVAILABLE",
            }, null, { session });
            if (seats.length !== seatIds.length) {
                throw new Error("Some seats are already reserved or invalid");
            }
            const expiry = new Date(Date.now() + 5 * 60 * 1000);
            const result = await seat_model_1.default.updateMany({
                _id: { $in: seatIds },
                status: "AVAILABLE",
            }, {
                $set: {
                    status: "RESERVED",
                    reservedBy: userId,
                    reservedUntil: expiry,
                },
            }, { session });
            if (result.modifiedCount !== seatIds.length) {
                throw new Error("Unable to reserve selected seats");
            }
            const totalAmount = event.price * seatIds.length;
            const bookingKey = await this.getNextBookingId(session);
            const booking = await booking_model_1.default.create([
                {
                    user: userId,
                    event: eventId,
                    seats: seatIds,
                    totalAmount,
                    status: "PENDING",
                    reservedUntil: expiry,
                    bookingKey,
                },
            ], { session });
            await session.commitTransaction();
            return {
                message: "Seats reserved successfully",
                bookingId: booking[0]._id,
                reservedUntil: expiry,
            };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async confirmBooking(userId, bookingId) {
        await this.releaseExpiredReservations();
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            console.log("bookingId", bookingId);
            const booking = await booking_model_1.default.findOne({
                _id: bookingId,
                user: userId,
                // status: "PENDING",
            }).session(session);
            if (!booking) {
                throw new Error("Booking not found");
            }
            if (booking.paymentStatus === "PAID") {
                throw new Error("Booking already paid");
            }
            if (booking.status == "CANCELLED") {
                throw new Error("Booking is already cancelled");
            }
            booking.status = "CONFIRMED";
            booking.paymentStatus = "PAID";
            const event = await event_model_1.default.findById(booking.event).session(session);
            if (!event) {
                throw new Error("Event not found");
            }
            const seats = await seat_model_1.default.find({
                _id: { $in: booking.seats },
                event: booking.event,
                reservedBy: userId,
                status: "RESERVED",
            }, null, { session });
            if (seats.length !== booking.seats.length) {
                throw new Error("Reservation expired ");
            }
            const wallet = await user_model_1.default.findOneAndUpdate({
                _id: userId,
                walletBalance: { $gte: booking.totalAmount },
            }, {
                $inc: {
                    walletBalance: -booking.totalAmount,
                },
            }, {
                session,
                new: true,
            }).session(session);
            // console.log("walletBalance", wallet);
            if (!wallet) {
                throw new Error("Insufficient wallet balance");
            }
            const walletTransaction = await walletTrans_model_1.default.findOne({
                user: userId,
                booking: booking._id,
            }).session(session);
            if (walletTransaction) {
                throw new Error("Booking already confirmed");
            }
            await booking.save({ session });
            await walletTrans_model_1.default.create([
                {
                    user: userId,
                    booking: booking._id,
                    type: "DEBIT",
                    amount: booking.totalAmount,
                    paymentGateway: "Wallet",
                    status: "SUCCESS",
                    paymentId: `wallet_${booking._id}`,
                    orderId: `booking_${booking._id}`,
                },
            ], { session });
            await seat_model_1.default.updateMany({
                _id: { $in: booking.seats },
            }, {
                $set: {
                    status: "BOOKED",
                    reservedBy: null,
                    reservedUntil: null,
                },
            }, { session });
            await session.commitTransaction();
            return { booking, walletBalance: wallet.walletBalance };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async getBookingHistory(userId) {
        return booking_model_1.default.find({ user: userId })
            .populate("event")
            .populate("seats")
            .sort({ createdAt: -1 });
    }
    ;
    async getBookingDetail(userId, bookingId) {
        await this.releaseExpiredReservations();
        console.log(userId, bookingId);
        const booking = await booking_model_1.default.findById(bookingId)
            .populate({
            path: "event",
            select: "title description venue eventDate eventTime image price",
        })
            .populate({
            path: "seats",
            select: "seatNumber row category status",
        });
        if (!booking) {
            throw new Error("Booking not found");
        }
        return {
            bookingId: booking._id,
            status: booking.status,
            totalAmount: booking.totalAmount,
            reservedUntil: booking.reservedUntil,
            event: booking.event,
            seats: booking.seats,
        };
    }
    ;
    async getBookingsHistory(userId, req) {
        let { page = 1, limit = 10, status } = req.query;
        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;
        const filter = {
            user: userId,
        };
        if (status) {
            filter.status = status;
        }
        const [bookings, total] = await Promise.all([
            booking_model_1.default.find(filter)
                .populate("event")
                .populate("seats")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            booking_model_1.default.countDocuments(filter),
        ]);
        return {
            bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getAllUserBookings(req) {
        let { page = 1, limit = 10, status, userId, eventId, search } = req.query;
        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (eventId) {
            filter.event = eventId;
        }
        if (search) {
            const users = await user_model_1.default.find({
                $or: [
                    {
                        name: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            }).select("_id");
            filter.user = {
                $in: users.map((u) => u._id),
            };
        }
        const [bookings, total] = await Promise.all([
            booking_model_1.default.find(filter)
                .populate("user", "name email")
                .populate("event")
                .populate("seats")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            booking_model_1.default.countDocuments(filter),
        ]);
        return {
            bookings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async cancelBooking(bookingId) {
        try {
            const booking = await booking_model_1.default.findById(bookingId);
            // console.log(booking);
            if (!booking) {
                throw new Error("Booking not found");
            }
            if (booking.status == "CANCELLED") {
                throw new Error("Booking already cancelled");
            }
            booking.status = "CANCELLED";
            // booking.refunded = true;
            // booking.refundedAt = new Date();
            // booking.refundAmount = booking.totalAmount;
            const result = await booking.save();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async refundBooking(bookingId) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const booking = await booking_model_1.default.findById(bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }
            if (booking.status !== "CANCELLED") {
                throw new Error("Only cancelled bookings can be refunded");
            }
            if (booking.refunded) {
                throw new Error("Booking already refunded");
            }
            booking.refunded = true;
            booking.refundedAt = new Date();
            booking.refundAmount = booking.totalAmount;
            booking.paymentStatus = "REFUNDED";
            const wallet = await user_model_1.default.findOneAndUpdate({
                _id: booking.user,
            }, {
                $inc: {
                    walletBalance: +booking.totalAmount,
                },
            }, {
                session,
                new: true,
            }).session(session);
            if (!wallet) {
                throw new Error("User not found");
            }
            // console.log("walletBalance", wallet);
            const walletTransaction = await walletTrans_model_1.default.findOne({
                user: booking.user,
                booking: booking._id,
                type: "REFUND",
            }).session(session);
            if (walletTransaction) {
                throw new Error("Booking already refunded in wallet");
            }
            // await booking.save({ session });
            await walletTrans_model_1.default.create([
                {
                    user: booking.user,
                    booking: booking._id,
                    type: "REFUND",
                    amount: booking.totalAmount,
                    paymentGateway: "Wallet",
                    status: "SUCCESS",
                    paymentId: `wallet_${booking._id}`,
                    orderId: `booking_${booking._id}`,
                },
            ], { session });
            await seat_model_1.default.updateMany({
                _id: { $in: booking.seats },
            }, {
                $set: {
                    status: "AVAILABLE",
                    reservedBy: null,
                    reservedUntil: null,
                },
            }, { session });
            await booking.save({ session });
            await session.commitTransaction();
            return { booking, walletBalance: wallet.walletBalance };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
}
exports.default = new BookingService();
