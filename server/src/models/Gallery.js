import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: false },
    description: { type: String, required: false },
    imageUrl: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: false },
});

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
