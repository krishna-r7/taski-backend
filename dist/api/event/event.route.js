"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = __importDefault(require("./event.controller"));
const router = (0, express_1.Router)();
router.post("/", event_controller_1.default.create);
router.get("/", event_controller_1.default.getAllEvents);
router.get("/upcoming-events", event_controller_1.default.getUpcomingEvents);
router.get("/EventNames", event_controller_1.default.getAllEventsName);
router.get("/:id", event_controller_1.default.getOne);
router.put("/:id", event_controller_1.default.update);
router.delete("/:id", event_controller_1.default.delete);
router.get("/:id/seats", event_controller_1.default.seats);
exports.default = router;
