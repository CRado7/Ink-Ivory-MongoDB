import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Artists.css";

const Artists = () => {
    const [artists, setArtists] = useState([]);

    const fetchArtists = async (setArtists) => {
        try {
          const response = await axios.get("/api/artists");
          console.log("Fetched artists:", response.data);
          setArtists(response.data);
        } catch (error) {
          console.error("Error fetching artists:", error);
        }
      };

        useEffect(() => {
            fetchArtists(setArtists);
          }
        , []);

    return (
        <div className="container">
        <section className="artists" id="artists-section">
            <h2>Meet Our Artists</h2>
            <div className="artist-grid">
                {/* <div className="artist-card-container"> */}
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
                            <button><a href={artist.portfolio} target="blank">View Portfolio</a></button>
                            <button>Book A Consult</button>
                        </div>
                        </div>
                    ))}
                {/* </div> */}
            </div>
        </section>
        </div>
    );
    }

export default Artists;