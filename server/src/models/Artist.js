import mongoose from "mongoose";

// Import models for reference
import Appointment from "./Appointment.js";
import TimeOffRequest from "./TimeOff.js";

// Helper function to generate a random hex color
const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    services: { type: [String], required: true },
    portfolio: { type: String, required: true },
    profilePic: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    appointmentColor: { type: String, required: true, default: generateRandomColor },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    requestedTimeOff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeOffRequest' }],
});

// Pre-save hook to generate a random appointment color
artistSchema.pre('save', function(next) {
    if (!this.appointmentColor) {
        this.appointmentColor = generateRandomColor();
    }
    next();
});

const Artist = mongoose.model("Artist", artistSchema);
export default Artist;




