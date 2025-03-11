import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);

  const fetchGallery = async () => {
    try {
      const response = await axios.get("/api/gallery");
      setImages(response.data);
    } catch (error) {
      console.error("🔥 Error fetching gallery:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <div className="gallery">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image._id} className="gallery-item">
            <img src={image.imageUrl} alt="Gallery" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
