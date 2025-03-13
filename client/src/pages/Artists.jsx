import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Artists.css";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ Success message state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
  });

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("/api/artists");
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  const openModal = (artist) => {
    setSelectedArtist(artist);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      email: "",
      preferredDate: "",
      preferredTime: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedArtist) return;

    try {
      const requestData = {
        ...formData,
        artistName: selectedArtist.name,
      };

      // ✅ Send data to backend route
      await axios.post("/api/consult", requestData);

      // ✅ Show success message
      setSuccessMessage("✅ Consult request sent successfully!");
      closeModal();

      // ✅ Automatically close after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("🔥 Error sending consult request:", error);
      alert("❌ Failed to send consult request");
    }
  };

  return (
    <div className="container">
      <section className="artists" id="artists-section">
        <h2>Meet Our Artists</h2>
        <div className="artist-grid">
          {artists.map((artist) => (
            <div key={artist.id} className="artist-card">
              <img src={artist.profilePic} alt={artist.name} />
              <h3>{artist.name}</h3>
              <ul>
                {artist.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              <div className="buttons">
                <button>
                  <a href={artist.portfolio} target="_blank" rel="noopener noreferrer">
                    View Portfolio
                  </a>
                </button>
                <button onClick={() => openModal(artist)}>Book A Consult</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <h2>Book a Consult with {selectedArtist?.name}</h2>
            <form onSubmit={handleSubmit} className="consult-form">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Preferred Date</label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
              />

              <label>Preferred Time</label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
              />

              <button type="submit">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Success Message Modal */}
      {successMessage && (
        <div className="success-modal">
          <div className="success-content">
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artists;
