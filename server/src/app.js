import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { config } from "./config/env.js";

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Logger

// Default route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Connect to DB
connectDB();

export default app;