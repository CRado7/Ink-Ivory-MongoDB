import Appointment from "../models/Appointment.js";
import Artist from "../models/Artist.js";

// Create an appointment
export const createAppointment = async (req, res) => {
  try {
      // console.log("🚀 Creating appointment with data:", req.body);

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

      console.log("✅ Appointment successfully created:", appointment);
      res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
      console.error("🔥 Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment on back end", error });
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
            { _id: appointmentId, artist: artistId }, // Ensure the appointment belongs to the correct artist
            req.body,
            { new: true }
        );

        if (!updatedAppointment) {
            console.log("Appointment not found");
            return res.status(404).json({ message: "Appointment not found" });
        }

        console.log("Appointment updated successfully");
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
      console.log(`Deleting appointment: ${appointmentId} for artist: ${artistId}`);
    
      // Find and delete the appointment
      const deletedAppointment = await Appointment.findOneAndDelete({
        _id: appointmentId,
        artist: artistId, // Ensure the appointment belongs to the correct artist
      });
    
      if (!deletedAppointment) {
        console.log("Appointment not found");
        return res.status(404).json({ message: "Appointment not found" });
      }
    
      // Remove the appointment reference from the artist's appointments array
      await Artist.findByIdAndUpdate(artistId, {
        $pull: { appointments: appointmentId },
      });
    
      console.log("Appointment deleted successfully from artist and collection");
      res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Failed to delete appointment on backend:", error);
      res.status(500).json({ message: "Failed to delete appointment on backend", error });
    }  
  };
