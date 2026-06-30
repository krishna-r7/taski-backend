"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_route_1 = __importDefault(require("./booking/booking.route"));
const user_routes_1 = __importDefault(require("./user/user.routes"));
const wallet_route_1 = __importDefault(require("./wallet/wallet.route"));
const event_route_1 = __importDefault(require("./event/event.route"));
// import bookingRouter from "./booking/booking.route";
const router = express_1.default.Router();
router.use("/booking", booking_route_1.default);
router.use("/user", user_routes_1.default);
router.use("/wallet", wallet_route_1.default);
router.use("/events", event_route_1.default);
exports.default = router;
