"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const seatSchema = new mongoose_1.Schema({
    event: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    seatNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "RESERVED", "BOOKED"],
        default: "AVAILABLE",
    },
    reservedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    seatIndex: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    reservedUntil: Date,
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Seat", seatSchema);
