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

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    setUploading(true);
    const uploadedUrls = [];
  
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_unsigned_preset");
      formData.append("folder", "InkIvory/Gallery");
  
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dwp2h5cak/image/upload`,
          formData
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("🔥 Error uploading file to Cloudinary:", error);
      }
    }
  
    if (uploadedUrls.length > 0) {
      try {
        // ✅ Send one request per uploaded image URL
        await Promise.all(
          uploadedUrls.map(async (url) => {
            await axios.post("/api/gallery/upload", { imageUrl: url });
          })
        );
        console.log("✅ Images saved to database");
      } catch (error) {
        console.error("🔥 Error saving to database:", error);
      }
    }
  
    setUploading(false);
    setFiles([]);
  };
  

  return (
    <div className="gallery-upload">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & Drop images here, or click to select</p>
      </div>

      {files.length > 0 && (
        <div className="dropzone-preview">
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
