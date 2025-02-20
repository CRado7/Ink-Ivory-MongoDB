import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadImage, deleteImage, getImagesByArtist } from "../controllers/galleryController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.delete("/:id", deleteImage);
router.get("/artist/:artistId", getImagesByArtist);

export default router;
