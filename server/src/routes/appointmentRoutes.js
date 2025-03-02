import express from "express";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointmentsByArtist,
  getAllAppointments,
  getAppointmentById
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/:artistId/appointments", createAppointment);
router.get("/", getAllAppointments); // Get all appointments across all artists
router.get("/:artistId/appointments", getAllAppointmentsByArtist); // Get all appointments for an artist
router.get("/:artistId/appointments/:appointmentId", getAppointmentById); // Get a specific appointment
router.put("/:artistId/appointments/:appointmentId", updateAppointment);
router.delete("/:artistId/appointments/:appointmentId", deleteAppointment);

export default router;

