import Gallery from "../models/Gallery.js";

// Create Gallery Item (only metadata)
export const createGalleryItem = async (req, res) => {
    try {
        const { title, description, imageUrl, artistId } = req.body;
        
        const newGalleryItem = new Gallery({
            title,
            description,
            imageUrl,  // The Cloudinary URL sent from the frontend
            artist: artistId,
        });

        await newGalleryItem.save();
        res.status(201).json(newGalleryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Image
export const deleteImage = async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);
        if (!galleryItem) return res.status(404).json({ message: "Gallery item not found" });

        // Remove the gallery item from the database
        await Gallery.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Gallery item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Images for an Artist
export const getImagesByArtist = async (req, res) => {
    try {
        const images = await Gallery.find({ artist: req.params.artistId });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
