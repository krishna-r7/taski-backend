"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    event: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    seats: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Seat",
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["CONFIRMED", "CANCELLED", "PENDING",],
        default: "PENDING",
    },
    paymentStatus: {
        type: String,
        enum: ["PAID", "UNPAID", "REFUNDED"],
        default: "UNPAID",
    },
    reservedUntil: {
        type: Date,
        default: null,
    },
    bookingKey: {
        type: String,
        required: true,
    },
    refunded: {
        type: Boolean,
        default: false,
    },
    refundedAt: {
        type: Date,
        default: null,
    },
    refundAmount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Booking", bookingSchema);
