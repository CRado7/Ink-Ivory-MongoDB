import TimeOffRequest from "../models/TimeOff.js";
import Artist from "../models/Artist.js";

// Create a time-off request
export const createTimeOffRequest = async (req, res) => {
  try {
    console.log("Received raw body:", req.body); // <-- Log full request body

    // Debugging: check what fields exist
    console.log("Type of req.body:", typeof req.body);
    console.log("Start field:", req.body.start);
    console.log("End field:", req.body.end);

    if (!req.body.start || !req.body.end) {
      return res.status(400).json({ message: "Start and End fields are required" });
    }

    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    const timeOff = new TimeOffRequest(req.body);
    await timeOff.save();

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
    const timeOffRequests = await TimeOffRequest.find();
    res.status(200).json(timeOffRequests);
  } catch (error) {
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
    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    artist.requestedTimeOff.id(req.params.timeOffId).remove();
    await artist.save();

    res.status(200).json({ message: "Time-off request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete time-off request", error });
  }
};
