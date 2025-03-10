import TimeOffRequest from "../models/TimeOff.js";
import Artist from "../models/Artist.js";

// Create a time-off request
export const createTimeOffRequest = async (req, res) => {
  try {
    // console.log("Received raw body:", req.body); // Debugging: Log full request body

    if (!req.body.start || !req.body.end) {
      return res.status(400).json({ message: "Start and End fields are required" });
    }

    // Find the artist
    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    // Create the time-off request with the artist reference
    const timeOff = new TimeOffRequest({
      artist: artist._id,  // <-- Explicitly add artist reference
      start: req.body.start,
      end: req.body.end,
      reason: req.body.reason,
    });

    await timeOff.save();

    // Push time-off request to artist's requestedTimeOff array
    artist.requestedTimeOff.push(timeOff._id);
    await artist.save();

    res.status(201).json({ message: "Time-off request created", timeOff });
  } catch (error) {
    console.error("Error creating time-off request:", error);
    res.status(500).json({ message: "Failed to create time-off request", error });
  }
};


// Get all time-off requests across all artists
export const getAllTimeOffRequests = async (req, res) => {
  try {
    // Populate the 'artist' field, retrieving only the 'name' field from the Artist model
    const timeOffRequests = await TimeOffRequest.find().populate("artist", "name");
    console.log(timeOffRequests);
    
    res.status(200).json(timeOffRequests);
  } catch (error) {
    console.error("Error fetching time-off requests:", error);
    res.status(500).json({ message: "Failed to fetch time-off requests", error });
  }
};


// Get all time-off requests for a specific artist
export const getAllTimeOffRequestsByArtist = async (req, res) => {
    try {
      const artist = await Artist.findById(req.params.artistId).populate('requestedTimeOff');
      if (!artist) return res.status(404).json({ message: "Artist not found" });
      res.status(200).json(artist.requestedTimeOff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time-off requests", error });
    }
  };
  
  // Get a specific time-off request by its ID
  export const getTimeOffRequestById = async (req, res) => {
    try {
      const artist = await Artist.findById(req.params.artistId).populate('requestedTimeOff');
      if (!artist) return res.status(404).json({ message: "Artist not found" });
  
      const timeOff = artist.requestedTimeOff.id(req.params.timeOffId);
      if (!timeOff) return res.status(404).json({ message: "Time-off request not found" });
  
      res.status(200).json(timeOff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time-off request", error });
    }
  };
  

// Update a time-off request
export const updateTimeOffRequest = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    const timeOff = artist.requestedTimeOff.id(req.params.timeOffId);
    if (!timeOff) return res.status(404).json({ message: "Time-off request not found" });

    Object.assign(timeOff, req.body);
    await artist.save();

    res.status(200).json({ message: "Time-off request updated successfully", timeOff });
  } catch (error) {
    res.status(500).json({ message: "Failed to update time-off request", error });
  }
};

// Delete a time-off request
export const deleteTimeOffRequest = async (req, res) => {
  try {
    const { artistId, timeOffId } = req.params;

    // Find the artist and ensure they exist
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Remove the time-off request from the artist's array
    artist.requestedTimeOff = artist.requestedTimeOff.filter(
      (id) => id.toString() !== timeOffId
    );
    await artist.save();

    // Delete the actual time-off request from the TimeOffRequest collection
    const deletedTimeOff = await TimeOffRequest.findByIdAndDelete(timeOffId);
    if (!deletedTimeOff) {
      return res.status(404).json({ message: "Time-off request not found" });
    }

    res.status(200).json({ message: "Time-off request deleted successfully" });
  } catch (error) {
    console.error("Error deleting time-off request:", error);
    res.status(500).json({ message: "Failed to delete time-off request", error });
  }
};

