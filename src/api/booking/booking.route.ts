import { Router } from "express";
import bookingController from "./booking.controller";

const router = Router();

router.post("/reserve",  bookingController.reserveSeats);
router.post("/confirm", bookingController.confirmBooking);
// router.get("/history",bookingController.getBookingHistory);
router.get("/detail/:id", bookingController.getBookingDetail);
// router.get("/pending", bookingController.getBookingsByUserId);
router.get("/history", bookingController.getBookings);

router.get("/all", bookingController.getAllUserBookings);


router.put("/cancel/:id", bookingController.cancelBooking);
router.put("/refund/:id", bookingController.refundBooking);



export default router;