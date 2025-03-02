import express from "express";
import {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist
} from "../controllers/artistController.js";

const router = express.Router();

router.post("/", createArtist);
router.get("/", getAllArtists);
router.get("/:artistId", getArtistById);
router.put("/:artistId", updateArtist);
router.delete("/:artistId", deleteArtist);

export default router;

