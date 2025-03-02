import Artist from "../models/Artist.js";

// Create a new artist
export const createArtist = async (req, res) => {
  try {
    const artist = new Artist(req.body);
    await artist.save();
    res.status(201).json(artist);
  } catch (error) {
    res.status(500).json({ message: "Failed to create artist", error });
  }
};

// Get all artists
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artists", error });
  }
};

// Get a specific artist by ID
export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).json({ message: "Artist not found" });
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artist", error });
  }
};

// Update an artist
export const updateArtist = async (req, res) => {
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(req.params.artistId, req.body, { new: true });
    if (!updatedArtist) return res.status(404).json({ message: "Artist not found" });
    res.status(200).json({ message: "Artist updated successfully", updatedArtist });
  } catch (error) {
    res.status(500).json({ message: "Failed to update artist", error });
  }
};

// Delete an artist
export const deleteArtist = async (req, res) => {
  try {
    const deletedArtist = await Artist.findByIdAndDelete(req.params.artistId);
    if (!deletedArtist) return res.status(404).json({ message: "Artist not found" });
    res.status(200).json({ message: "Artist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete artist", error });
  }
};

