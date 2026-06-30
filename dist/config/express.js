"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const routes_1 = __importDefault(require("../api/routes"));
const authHeaders_1 = require("../middleware/authHeaders");
const rateLimiter_1 = require("../middleware/rateLimiter");
const errorHandler_1 = require("../middleware/errorHandler");
const notFound_1 = require("../middleware/notFound");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
}));
app.use(rateLimiter_1.rateLimiter);
app.get("/", (_, res) => {
    res.json({
        success: true,
        message: `${process.env.APP_NAME} is running`,
    });
});
app.use(authHeaders_1.verifyToken);
app.use("/api", routes_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
