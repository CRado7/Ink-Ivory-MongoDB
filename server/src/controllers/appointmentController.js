import Appointment from "../models/Appointment.js";
import Artist from "../models/Artist.js";
import { sendEmail } from "../utils/Mailer.js";

// Create an appointment
export const createAppointment = async (req, res) => {
  try {
    const { name, date, startTime, endTime, email } = req.body;

    const artist = await Artist.findById(req.params.artistId);
    if (!artist) {
      console.log("❌ Artist not found");
      return res.status(404).json({ message: "Artist not found" });
    }

    // Save the appointment directly to the Appointment collection
    const appointment = new Appointment({
      ...req.body,
      artist: artist._id, // Associate the appointment with the artist
    });

    await appointment.validate(); // Validate before saving
    await appointment.save();

    // Push the appointment ID to the artist's appointments array
    artist.appointments.push(appointment._id);
    await artist.save();

    // ✅ Format date and time
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedStartTime = new Date(`${date}T${startTime}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedEndTime = new Date(`${date}T${endTime}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const emailSubject = `Appointment Confirmation - Ink & Ivory`;
    const emailBody = `
      <div style="
        font-family: Arial, sans-serif;
        color: #333;
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #eaeaea;
        border-radius: 8px;
        background-color: #fafafa;
      ">
        <h2 style="
          color: #4CAF50;
          font-size: 24px;
          margin-bottom: 10px;
          text-align: center;
        ">
          Appointment Confirmation
        </h2>
        <p style="
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 10px;
        ">
          Hi <strong>${name}</strong>,
        </p>
        <p style="
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 10px;
        ">
          Your appointment with <strong>${artist.name}</strong> is confirmed!
        </p>
        <div style="
          background-color: #f9f9f9;
          padding: 15px;
          border-left: 4px solid #4CAF50;
          margin-bottom: 20px;
        ">
          <p style="margin: 0; font-size: 16px;">
            <strong>Date:</strong> ${formattedDate}<br>
            <strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}
          </p>
        </div>
        <p style="
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 10px;
        ">
          Thank you for choosing <strong>Ink & Ivory</strong>! We look forward to seeing you.
        </p>
        <div style="
          text-align: center;
          margin-top: 20px;
        ">
          <a href="https://inkandivory.com" style="
            background-color: #4CAF50;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 4px;
            display: inline-block;
          ">
            Visit Our Website
          </a>
        </div>
        <footer style="
          margin-top: 30px;
          font-size: 14px;
          color: #999;
          text-align: center;
        ">
          © 2025 Ink & Ivory. All rights reserved.
        </footer>
      </div>
    `;

    // ✅ Send the email
    await sendEmail(email, emailSubject, "", emailBody);

    console.log("✅ Appointment successfully created:", appointment);
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    console.error("🔥 Error creating appointment:", error);
    
    // Better error handling
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid input data", error: error.message });
    }

    res.status(500).json({ message: "Failed to create appointment", error: error.message });
  }
};

// NEW: Get all appointments across all artists
export const getAllAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find().populate("artist"); // Populate artist details if needed
      console.log(appointments);
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments", error });
    }
  };

// Get all appointments for a specific artist
export const getAllAppointmentsByArtist = async (req, res) => {
    try {
      const artist = await Artist.findById(req.params.artistId).populate('appointments');
      if (!artist) return res.status(404).json({ message: "Artist not found" });
      res.status(200).json(artist.appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointments", error });
    }
  };
  
  // Get a specific appointment by its ID
  export const getAppointmentById = async (req, res) => {
    try {
      const artist = await Artist.findById(req.params.artistId).populate('appointments');
      if (!artist) return res.status(404).json({ message: "Artist not found" });
  
      const appointment = artist.appointments.id(req.params.appointmentId);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
  
      res.status(200).json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appointment", error });
    }
  };

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const { artistId, appointmentId } = req.params;
    console.log(`Updating appointment: ${appointmentId} for artist: ${artistId}`);

    // Convert textReminder and emailReminder to booleans if they exist
    if (req.body.textReminder !== undefined) {
      req.body.textReminder = req.body.textReminder === "true" || req.body.textReminder === true;
    }
    if (req.body.emailReminder !== undefined) {
      req.body.emailReminder = req.body.emailReminder === "true" || req.body.emailReminder === true;
    }

    // Find and update the appointment
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, artist: artistId },
      req.body,
      { new: true }
    ).populate('artist');

    if (!updatedAppointment) {
      console.log("Appointment not found");
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Format date correctly without timezone shift
    const formatDate = (date) => {
      const [year, month, day] = date.split('-'); // Split "YYYY-MM-DD"
      const formattedDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return formattedDate;
    };
    
    const newFormattedDate = formatDate(updatedAppointment.date.toISOString().split('T')[0]);
    console.log("Formatted Date:", newFormattedDate);

    // Format time to 12-hour format
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    };

    const start = formatTime(updatedAppointment.startTime);
    const end = formatTime(updatedAppointment.endTime);

    // Send email after updating appointment
    const emailSubject = "Appointment Updated - Ink & Ivory";
    const emailBody = `
    <div style="
      font-family: Arial, sans-serif;
      color: #333;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #eaeaea;
      border-radius: 8px;
      background-color: #fafafa;
    ">
      <h2 style="color: #4CAF50; font-size: 24px; margin-bottom: 10px; text-align: center;">
        Appointment Updated
      </h2>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        Hi <strong>${updatedAppointment.name}</strong>,
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        Your appointment with <strong>${updatedAppointment.artist.name}</strong> has been successfully updated!
      </p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 16px;">
          <strong>Date:</strong> ${newFormattedDate}<br>
          <strong>Time:</strong> ${start} - ${end}
        </p>
      </div>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        Thank you for choosing <strong>Ink & Ivory</strong>! We look forward to seeing you.
      </p>
      <footer style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
        © 2025 Ink & Ivory. All rights reserved.
      </footer>
    </div>
    `;
    const email = updatedAppointment.email;
    await sendEmail(email, emailSubject, "", emailBody);

    console.log("✅ Appointment updated and email sent to client");
    res.status(200).json({ message: "Appointment updated successfully", updatedAppointment });
  } catch (error) {
    console.error("Failed to update appointment on backend:", error);
    res.status(500).json({ message: "Failed to update appointment on backend", error });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { artistId, appointmentId } = req.params;
    console.log(`Deleting appointment: ${appointmentId} for artist: ${artistId}, ${artistId.name}`);

    // Find and delete the appointment
    const deletedAppointment = await Appointment.findOneAndDelete({
      _id: appointmentId,
      artist: artistId, // Ensure the appointment belongs to the correct artist
    }).populate('artist');

    if (!deletedAppointment) {
      console.log("Appointment not found");
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Remove the appointment reference from the artist's appointments array
    await Artist.findByIdAndUpdate(artistId, {
      $pull: { appointments: appointmentId },
    });

    // Send email after deleting appointment
    const emailSubject = "Appointment Cancelled - Ink & Ivory";
    const emailBody = `
    <div style="
      font-family: Arial, sans-serif;
      color: #333;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #eaeaea;
      border-radius: 8px;
      background-color: #fafafa;
    ">
      <h2 style="color: #f44336; font-size: 24px; margin-bottom: 10px; text-align: center;">
        Appointment Cancelled
      </h2>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        Hi <strong>${deletedAppointment.name}</strong>,
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        We're sorry to inform you that your appointment with <strong>${deletedAppointment.artist.name}</strong> has been cancelled.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
        If you have any questions or wish to reschedule, please don’t hesitate to contact us.
      </p>
      <footer style="margin-top: 30px; font-size: 14px; color: #999; text-align: center;">
        © 2025 Ink & Ivory. All rights reserved.
      </footer>
    </div>
    `;
    const email = deletedAppointment.email;
    await sendEmail(email, emailSubject, "", emailBody);

    console.log("✅ Appointment deleted and email sent to client");
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete appointment on backend:", error);
    res.status(500).json({ message: "Failed to delete appointment on backend", error });
  }
};

