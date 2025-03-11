import express from "express";
import { 
    createGalleryItem, 
    deleteImage, 
    getImagesByArtist,
    getGallery
} from "../controllers/galleryController.js";

const router = express.Router();

// Create Gallery Item (metadata + Cloudinary URL)
router.post("/upload", createGalleryItem);

// Delete Gallery Item
router.delete("/:id", deleteImage);

// Get All Images for an Artist
router.get("/:artistId", getImagesByArtist);

// Get All Images
router.get("/", getGallery);

export default router;

