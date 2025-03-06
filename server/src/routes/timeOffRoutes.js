import express from "express";
import {
  createTimeOffRequest,
  updateTimeOffRequest,
  deleteTimeOffRequest,
  getAllTimeOffRequests,
  getAllTimeOffRequestsByArtist,
  getTimeOffRequestById
} from "../controllers/timeOffController.js";

const router = express.Router();

router.post("/:artistId", createTimeOffRequest);
router.get("/", getAllTimeOffRequests); // Get all time-off requests
router.get("/:artistId/time-off", getAllTimeOffRequestsByArtist); // Get all time-off requests for an artist
router.get("/:artistId/time-off/:timeOffId", getTimeOffRequestById); // Get a specific time-off request
router.put("/:artistId/time-off/:timeOffId", updateTimeOffRequest);
router.delete("/:artistId/time-off/:timeOffId", deleteTimeOffRequest);

export default router;

