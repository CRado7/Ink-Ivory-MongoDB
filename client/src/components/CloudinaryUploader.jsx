import React, { useState } from "react";

const CloudinaryUploader = ({ onFilesSelected }) => {
  const [previewUrls, setPreviewUrls] = useState([]); 
  const [selectedFiles, setSelectedFiles] = useState([]); 

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...previews]);
    setSelectedFiles((prev) => [...prev, ...files]);

    onFilesSelected(files); // Pass selected files to parent component
  };

  const handleRemoveImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

    onFilesSelected(selectedFiles.filter((_, i) => i !== index)); // Update parent with the remaining selected files
  };

  return (
    <div className="cloudinary full">
      <input type="file" multiple accept="image/*" onChange={handleFileSelection} />
      <div className="previews">
        {previewUrls.map((url, index) => (
          <div key={index} className="preview-container">
            <img src={url} alt={`Preview ${index}`} className="preview" />
            <button onClick={() => handleRemoveImage(index)} className="delete-button">✖</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudinaryUploader;

