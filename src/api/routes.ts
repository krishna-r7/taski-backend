import express from "express";
import bookingRouter from "./booking/booking.route";
import userRouter from "./user/user.routes";
import walletRouter from "./wallet/wallet.route";
import eventRouter from "./event/event.route";
// import bookingRouter from "./booking/booking.route";

const router = express.Router();

router.use("/booking", bookingRouter);      
router.use("/user", userRouter);    
router.use("/wallet", walletRouter);
router.use("/events", eventRouter);


export default router;