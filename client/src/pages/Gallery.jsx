import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

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

  useEffect(() => {
    // Disable background scrolling when modal is open
    if (currentIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [currentIndex]);

  const openModal = (index) => {
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setCurrentIndex(null);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Handle arrow keys to navigate images
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex !== null) {
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "Escape") closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  return (
    <div className="gallery">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <div
            key={image._id}
            className="gallery-item"
            onClick={() => openModal(index)}
          >
            <img src={image.imageUrl} alt="Gallery" />
          </div>
        ))}
      </div>

      {/* Modal */}
      {currentIndex !== null && (
        <div className="image-modal-overlay" onClick={closeModal}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="image-close-button" onClick={closeModal}>
              &times;
            </button>
            <img
              src={images[currentIndex].imageUrl}
              alt="Selected"
              className="modal-image"
            />

            {/* Left and right buttons */}
            <button className="nav-button left" onClick={goToPrevious}>
              &#10094;
            </button>
            <button className="nav-button right" onClick={goToNext}>
              &#10095;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;


