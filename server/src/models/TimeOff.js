import mongoose from "mongoose";

const requestedTimeOffSchema = new mongoose.Schema({
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    reason: { type: String, required: true },
});

export default requestedTimeOffSchema;
