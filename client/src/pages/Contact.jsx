import React, { useState } from "react";
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" }); // Reset form after submission
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>We’d love to hear from you! Fill out the form below or reach out directly.</p>

      <div className="contact-content">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="contact-form">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} required />

          <button type="submit">Send Message</button>
        </form>

        {/* Contact Info */}
        <div className="contact-info">
          <h3>Visit Us</h3>
          <p>123 Ink Street, Tattoo City, TX 78910</p>

          <h3>Call Us</h3>
          <p>(555) 123-4567</p>

          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
