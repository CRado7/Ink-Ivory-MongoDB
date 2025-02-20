import Gallery from "../models/Gallery.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Helper to get absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload Image
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const artistId = req.body.artistId;
        const newGalleryItem = new Gallery({
            title: req.body.title,
            description: req.body.description,
            imageUrl: `/uploads/gallery/${artistId}/${req.file.filename}`,
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

        // Construct full image path
        const imagePath = path.join(__dirname, "../", galleryItem.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Remove from database
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
