import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import "../styles/GalleryUpload.css";

const GalleryUpload = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_unsigned_preset"); // Change to your preset
      formData.append("folder", "InkIvory/Gallery"); // Store in the gallery folder

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dwp2h5cak/image/upload`,
          formData
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setUploading(false);
    setFiles([]); // Reset file list after upload

    if (onUploadComplete) {
      onUploadComplete(uploadedUrls); // Pass URLs to parent component
    }
  };

  return (
    <div className="gallery-upload">
      <div {...useDropzone({ onDrop })} className="dropzone">
        <p>Drag & Drop images here, or click to select</p>
      </div>

      {files.length > 0 && (
        <div className="preview">
          {files.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt="preview" />
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};

export default GalleryUpload;
