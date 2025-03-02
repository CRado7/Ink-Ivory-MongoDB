import TimeOffRequest from "../models/TimeOff.js";
import Artist from "../models/Artist.js";

// Create a time-off request
export const createTimeOffRequest = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });

    const timeOff = new TimeOffRequest(req.body);
    artist.requestedTimeOff.push(timeOff);
    await artist.save();

    res.status(201).json({ message: "Time-off request created", timeOff });
  } catch (error) {
    res.status(500).json({ message: "Failed to create time-off request", error });
  }
};

// Get all time-off requests for a specific artist
export const getAllTimeOffRequests = async (req, res) => {
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
