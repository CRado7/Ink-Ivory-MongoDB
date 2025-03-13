import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, enum: ["Tattoo", "Piercing", "Consult"], required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true, index: { expires: "180d" } },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    deposit: { type: Number, required: true },
    total: { type: Number, required: true },
    referencePhotos: { type: [String] }, // Updated to an array for reference photos
    additionalDetails: { type: String, required: false },
    safetyWaiver: { type: String, required: false}, // File attachment (URL or file path)
    textReminder: { type: Boolean, required: true },
    emailReminder: { type: Boolean, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;


