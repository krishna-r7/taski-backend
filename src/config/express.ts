import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db";
import routes from "../api/routes";

import { verifyToken } from "../middleware/authHeaders";
import { rateLimiter } from "../middleware/rateLimiter";
import { errorHandler } from "../middleware/errorHandler";
import { notFound } from "../middleware/notFound";


dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(rateLimiter);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: `${process.env.APP_NAME} is running`,
  });
});


app.use(verifyToken);

app.use("/api", routes);

app.use(notFound);

app.use(errorHandler);

export default app;