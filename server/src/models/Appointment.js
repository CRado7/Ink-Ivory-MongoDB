import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, enum: ["Tattoo", "Piercing"], required: true },
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

// Prevent scheduling appointments in the past
appointmentSchema.pre("validate", async function (next) {
    if (this.date < new Date()) {
        return next(new Error("Appointment date cannot be in the past."));
    }

    // Check for overlapping appointments for the specific artist
    const Artist = mongoose.model("Artist");
    const artist = await Artist.findOne({ "appointments._id": this._id });

    if (artist) {
        const overlapping = artist.appointments.some((appointment) => {
            return (
                appointment._id.toString() !== this._id.toString() && // Exclude current appointment
                appointment.date.toDateString() === this.date.toDateString() &&
                (
                    (this.startTime >= appointment.startTime && this.startTime < appointment.endTime) ||
                    (this.endTime > appointment.startTime && this.endTime <= appointment.endTime)
                )
            );
        });

        if (overlapping) {
            return next(new Error("This time slot is already booked for this artist."));
        }
    }

    next();
});

// Middleware to delete files when appointment is removed (manual or automatic)
appointmentSchema.pre('remove', async function (next) {
    try {
        // Delete safety waiver if exists
        if (this.safetyWaiver) {
            fs.unlinkSync(path.join(__dirname, '..', this.safetyWaiver));
        }

        // Delete reference photos if exists
        if (this.referencePhotos && this.referencePhotos.length > 0) {
            this.referencePhotos.forEach((photo) => {
                fs.unlinkSync(path.join(__dirname, '..', photo));
            });
        }

        next(); // Proceed with the removal
    } catch (error) {
        next(error); // Handle errors
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;


