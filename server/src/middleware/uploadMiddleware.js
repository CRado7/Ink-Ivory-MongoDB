import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;

    // Check for different upload types based on a field in the request
    if (req.body.uploadType === "gallery") {
      const artistId = req.body.artistId; // Ensure artist ID is sent in request
      uploadDir = `uploads/gallery/${artistId}`;
    } else if (req.body.uploadType === "appointment") {
      const appointmentId = req.body.appointmentId || "general"; // For appointments
      uploadDir = `uploads/appointments/${appointmentId}`;
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter based on upload type
const fileFilter = (req, file, cb) => {
  if (req.body.uploadType === "appointment") {
    if (file.fieldname === "safetyWaiver" && file.mimetype !== "application/pdf") {
      cb(new Error("Safety waiver must be a PDF."), false);
    } else if (file.fieldname === "referencePhotos" && !file.mimetype.startsWith("image/")) {
      cb(new Error("Reference photos must be images."), false);
    } else {
      cb(null, true);
    }
  } else {
    cb(null, true); // No specific filter for gallery uploads
  }
};

const upload = multer({ storage, fileFilter });

export default upload;

