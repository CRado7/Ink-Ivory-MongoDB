import mongoose from "mongoose";

const requestedTimeOffSchema = new mongoose.Schema({
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
    start:{
        date: { type: String, required: true },
        startTime: { type: String, required: true },
    },
    end:{
        date: { type: String, required: true },
        endTime: { type: String, required: true },
    },
    reason: { type: String, required: true },
});

const TimeOffRequest = mongoose.model("TimeOffRequest", requestedTimeOffSchema);
export default TimeOffRequest;
