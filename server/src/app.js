import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { config } from "./config/env.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import inkIvoryAdminRoutes from "./routes/inkIvoryAdminRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import timeOffRoutes from "./routes/timeOffRoutes.js";

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Logger

app.use(express.json()); 
// Routes
app.use("/uploads", express.static("uploads"));
app.use("/api/gallery", galleryRoutes);
app.use("/api/admins", inkIvoryAdminRoutes); 
app.use("/api/artists", artistRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/time-off", timeOffRoutes);

// Default routes
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Connect to DB
connectDB();

export default app;