import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true, index: { expires: "180d" } },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    deposit: { type: Number, required: true },
    total: { type: Number, required: true },
    referencePhotos: { type: String, required: true },
    additionalDetails: { type: String, required: true },
    safteyWaiver: { type: String, required: true },
    textReminder: { type: Boolean, required: true },
    emailReminder: { type: Boolean, required: true },
});

const requestedTimeOffSchema = new mongoose.Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    reason: { type: String, required: true },
});

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    services: { type: String, required: true },
    portfolio: { type: String, required: true },
    profilePic: { type: String, required: true },
    hourlyRate: { type: Number, required: true },
    appointmentColor: { type: String, required: true },
    appointments: [appointmentSchema],
    requestedTimeOff: [requestedTimeOffSchema],
});

const Artist = mongoose.model("Artist", artistSchema);  
export default Artist;