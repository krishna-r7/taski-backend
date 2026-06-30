"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = __importDefault(require("./booking.controller"));
const router = (0, express_1.Router)();
router.post("/reserve", booking_controller_1.default.reserveSeats);
router.post("/confirm", booking_controller_1.default.confirmBooking);
// router.get("/history",bookingController.getBookingHistory);
router.get("/detail/:id", booking_controller_1.default.getBookingDetail);
// router.get("/pending", bookingController.getBookingsByUserId);
router.get("/history", booking_controller_1.default.getBookings);
router.get("/all", booking_controller_1.default.getAllUserBookings);
router.put("/cancel/:id", booking_controller_1.default.cancelBooking);
router.put("/refund/:id", booking_controller_1.default.refundBooking);
exports.default = router;
