import mongoose from "mongoose";

// Import models for reference
import Appointment from "./Appointment.js";
import RequestedTimeOff from "./TimeOff.js";

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    services: { type: [String], required: true },
    portfolio: { type: String, required: true },
    profilePic: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    appointmentColor: { type: String, required: true },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    requestedTimeOff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeOff' }],
});

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;



