// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/config.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV === "production") job.start();

//middleware
app.use(express.json());
app.use(rateLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up in port:", PORT);
  });
});
