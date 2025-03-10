import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div>
      <header className="hero">
        <div className="hero-overlay" style={{ backgroundImage: "url('/tattoo-shop.jpg')" }}>
          <div className="hero-content">
            <h1>Welcome to Ink & Ivory</h1>
            <p>Where Art Meets Skin</p>
            <Link to="/book" className="cta-btn">
              Book a Consultation
            </Link>
          </div>
        </div>
      </header>

      <section className="about" id="about-section">
          <div className="shop-info">
            <h2>About Us</h2>
            <p>
              Nestled in the heart of the city, Ivory & Ink Tattoo Studio is a space where artistry and self-expression collide. Our studio is built on the foundation of creativity, craftsmanship, and a commitment to delivering high-quality tattoos in a welcoming environment. With a team of skilled artists specializing in a variety of styles—from delicate fine-line work to bold traditional designs—we take pride in bringing our clients' visions to life. Whether you're looking for a custom piece, a meaningful tribute, or a spontaneous work of art, we ensure every tattoo is a unique and carefully crafted experience.
              <br /> <br />
              At Ivory & Ink, we believe tattoos are more than just ink on skin; they tell stories, celebrate milestones, and embody personal journeys. That’s why we prioritize collaboration, taking the time to understand each client’s ideas and inspirations. Our studio maintains the highest standards of hygiene and professionalism, ensuring a safe and comfortable experience for every guest. Whether it’s your first tattoo or your hundredth, we’re here to make the process as seamless and memorable as possible. Come visit us, meet our artists, and let’s create something extraordinary together.
            </p>
          </div>
        </section>

      <section className="intro">
        <h2>Custom Tattoos by Passionate Artists</h2>
        <p>
          Our talented artists specialize in creating unique, custom tattoos tailored to your vision. Explore our work and book your consultation today!
        </p>
        <Link to="/artists" className="cta-link">
          Meet Our Artists
        </Link>
      </section>

      <section className="about tattoo-info" id="tattoo-care-section">
          <div className="care">
            <div className="after-care">
              <h2>TATTOO AFTERCARE INSTRUCTIONS</h2>
              <ol>
                <li>Leave the bandage on for 2-4 hours.</li>
                <li>Wash your tattoo with warm water and mild soap.</li>
                <li>Pat dry with a clean towel.</li>
                <li>Apply a thin layer of unscented lotion.</li>
                <li>Repeat this process 2-3 times a day.</li>
                <li>Avoid direct sunlight and swimming for 2 weeks.</li>
              </ol>
            </div>

            <div className="healing">
              <h2>HEALING PROCESS</h2>
              <ol>
                <li>Days 1-3: Swelling, redness, and tenderness are normal.</li>
                <li>Days 4-6: Peeling and itching may occur.</li>
                <li>Days 7-14: Scabbing and flaking are common.</li>
                <li>Days 15-30: Your tattoo will settle and heal.</li>
              </ol>
            </div>
          </div>
          <p className="advisory">
            <sup>**</sup>SHOULD YOU EXPERIENCE ANY UNEXPECTED REDNESS, TENDERNESS, SWELLING, RASH, OR UNEXPECTED DRAINAGE FROM THE TATTOO SITE, OR IF YOU EXPERIENCE A FEVER WITHIN 24 hours OF THE TATTOO, CONSULT YOUR MEDICAL PROVIDER.<sup>**</sup>
          </p>
        </section>
    </div>
  );
};

export default Home;





